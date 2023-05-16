using MongoDB.Driver;
using alfred_api.Data;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace alfred_api.Services;

public interface IUserService
{
    Task<UserModel?> CreateAsync(string userName, string password, string email);
    Task<UserModel?> LoginAsync(string userName, string password);
}

public class UserService : IUserService
{
    private readonly TaskContext _context;
    private readonly string _pepper;
    private readonly int _iteration;

    public UserService(TaskContext context)
    {
        _context = context;
        _pepper = "pepper";
        _iteration = 3;
    }

    public async Task<UserModel?> CreateAsync(string userName, string password, string email)
    {
        // check if user already exists
        var user = await _context.Users.FirstOrDefaultAsync(user => user.UserName == userName);

        if (user != null)
        {
            // log error and return null
            Console.WriteLine("User already exists");
            return null;
        }

        // generate salt
        var salt = generateSalt();

        // encrypt password
        var encryptedPassword = encryptPassword(password, salt, _pepper, _iteration);

        // create user
        var newUser = new UserModel
        {
            UserName = userName,
            PasswordHash = encryptedPassword,
            PasswordSalt = salt,
            Email = email
        };

        // add user to database
        await _context.Users.AddAsync(newUser);
        if (await _context.SaveChangesAsync() <= 0)
        {
            // log error and return null
            Console.WriteLine("User could not be created");
            return null;
        }

        // return user
        return newUser;
    }

    public async Task<UserModel?> LoginAsync(string userName, string password)
    {
        // get user from database
        var user = await _context.Users.FirstOrDefaultAsync(user => user.UserName == userName);

        if (user == null)
        {
            // log error and return null
            Console.WriteLine("User does not exist");
            return null;
        }

        // encrypt password
        var encryptedPassword = encryptPassword(password, user.PasswordSalt, _pepper, _iteration);

        // check if password matches
        if (encryptedPassword != user.PasswordHash)
        {
            // log error and return null
            Console.WriteLine("Password does not match");
            return null;
        }

        // return user
        return user;
    }

    private string encryptPassword(string password, string salt, string pepper, int iteration)
    {
        if (iteration <= 0) return password;

        using var sha256 = SHA256.Create();
        var passwordSaltPepper = password + salt + pepper;
        var passwordBytes = Encoding.UTF8.GetBytes(passwordSaltPepper);
        var hashBytes = sha256.ComputeHash(passwordBytes);
        var hashString = Encoding.UTF8.GetString(hashBytes);
        return encryptPassword(hashString, salt, pepper, iteration - 1);
    }

    private string generateSalt()
    {
        var random = new Random();
        var salt = new byte[32];
        random.NextBytes(salt);
        return Encoding.UTF8.GetString(salt);
    }
}