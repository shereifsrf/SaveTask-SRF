namespace alfred_api.Models.DTO;
public class UserDTO
{
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public required TokenDTO Token { get; set; }
}

public class RegisterRequestDTO
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Email { get; set; } = null!;
}

public class LoginRequestDTO
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}