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
    public async Task<List<TodoModel>> Get() =>
        await _todoService.GetAsync();

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<TodoModel>> Get(string id)
    {
        var todo = await _todoService.GetAsync(id);

        if (todo is null)
        {
            return NotFound();
        }

        return todo;
    }

    [HttpPost]
    public async Task<IActionResult> Post(TodoModel newTodo)
    {
        await _todoService.CreateAsync(newTodo);

        return CreatedAtAction(nameof(Get), new { id = newTodo.Id }, newTodo);
    }

    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, TodoModel updateTodo)
    {
        var todo = await _todoService.GetAsync(id);

        if (todo is null)
        {
            return NotFound();
        }

        updateTodo.Id = todo.Id;

        await _todoService.UpdateAsync(id, updateTodo);

        return NoContent();
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var book = await _todoService.GetAsync(id);

        if (book is null)
        {
            return NotFound();
        }

        await _todoService.RemoveAsync(id);

        return NoContent();
    }
}