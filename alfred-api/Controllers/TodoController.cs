using alfred_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace alfred_api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly TodoService _todoService;

    public TodosController(TodoService todoService) =>
        _todoService = todoService;

    [HttpGet]
    public async Task<List<TodoModel>> Get()
    {
        var userID = int.Parse(User.Claims.FirstOrDefault(x => x.Type == "user-id")?.Value ?? "0");
        return await _todoService.GetAsync(userID);
    }

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<TodoModel>> Get(string id)
    {
        // get the username from the token
        var userID = int.Parse(User.Claims.FirstOrDefault(x => x.Type == "user-id")?.Value ?? "0");
        var todo = await _todoService.GetAsync(id, userID);

        if (todo is null)
        {
            return NotFound();
        }

        return todo;
    }
    [HttpPost]
    public async Task<IActionResult> Post(TodoModel newTodo)
    {
        var userID = int.Parse(User.Claims.FirstOrDefault(x => x.Type == "user-id")?.Value ?? "0");
        newTodo.userID = userID;
        await _todoService.CreateAsync(newTodo);

        return CreatedAtAction(nameof(Get), new { id = newTodo.Id }, newTodo);
    }

    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, TodoModel updateTodo)
    {
        var userID = int.Parse(User.Claims.FirstOrDefault(x => x.Type == "user-id")?.Value ?? "0");
        var todo = await _todoService.GetAsync(id, userID);

        if (todo is null)
        {
            return NotFound();
        }

        updateTodo.Id = todo.Id;

        await _todoService.UpdateAsync(id, updateTodo);

        return Ok(updateTodo);
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var userID = int.Parse(User.Claims.FirstOrDefault(x => x.Type == "user-id")?.Value ?? "0");
        var book = await _todoService.GetAsync(id, userID);

        if (book is null)
        {
            return NotFound();
        }

        await _todoService.RemoveAsync(id);

        return Ok();
    }
}