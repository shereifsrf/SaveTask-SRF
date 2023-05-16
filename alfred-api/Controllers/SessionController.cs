// will login the user
using Microsoft.AspNetCore.Mvc;
using alfred_api.Models;
using alfred_api.Services;
using alfred_api.Models.DTO;

namespace alfred_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SessionController : ControllerBase
{
    private readonly SessionService _sessionService;

    public SessionController(SessionService sessionService) =>
        _sessionService = sessionService;

    // add session
    [HttpPost]
    // return void
    public IActionResult Create([FromBody] SessionDTO session)
    {
        if (session.Username is null)
        {
            return BadRequest();
        }

        // run background thread for create session
        Task.Run(() => _sessionService.CreateAsync(new SessionModel
        {
            UserName = session.Username,
        }));
        return Ok();
    }

}