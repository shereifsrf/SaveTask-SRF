
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using alfred_api.Models.DTO;

namespace alfred_api.Services;

public interface IAuthService
{
    TokenDTO GenerateToken(string userName);
}

public class AuthService : IAuthService
{
    public TokenDTO GenerateToken(string userName)
    {
        var jwt = new JwtSecurityTokenHandler();
        // get key from env
        var key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("ISSUER_KEY") ?? throw new Exception("JWT_SECRET not set"));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, userName)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = jwt.CreateToken(tokenDescriptor);
        return new TokenDTO
        {
            Token = jwt.WriteToken(token)
        };
    }
}