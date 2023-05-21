// will login the user
using Microsoft.AspNetCore.Mvc;
using alfred_api.Models.DTO;
using alfred_api.Services;

namespace alfred_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IAuthService _authService;

    public UserController(IUserService userService, IAuthService authService) =>
        (_userService, _authService) = (userService, authService);

    // user login
    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> Login([FromBody] LoginRequestDTO loginUser)
    {
        // log
        Console.WriteLine($"User {loginUser.Username} is trying to login");
        if (loginUser.Username is null || loginUser.Password is null)
        {
            return BadRequest();
        }

        var user = await _userService.LoginAsync(loginUser.Username, loginUser.Password);

        if (user is null)
        {
            return Unauthorized();
        }

        return new UserDTO
        {
            UserName = user.UserName,
            Email = user.Email,
            Token = _authService.GenerateToken(user.Id)
        };
    }

    // create user
    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> Create([FromBody] RegisterRequestDTO registerUser)
    {
        // log
        Console.WriteLine($"User {registerUser.Username} is trying to create an account");
        if (registerUser.Username is null || registerUser.Password is null || registerUser.Email is null)
        {
            return BadRequest();
        }

        var createUser = await _userService.CreateAsync(registerUser.Username, registerUser.Password, registerUser.Email);
        if (createUser is null)
        {
            return BadRequest();
        }

        return new UserDTO
        {
            UserName = createUser.UserName,
            Email = createUser.Email,
            Token = _authService.GenerateToken(createUser.Id)
        };
    }
}