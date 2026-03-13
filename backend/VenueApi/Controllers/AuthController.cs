using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace VenueApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthController(IConfiguration config) => _config = config;

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Username and password are required." });

        var adminUsername = _config["Admin:Username"] ?? "admin";
        var passwordHash = _config["Admin:PasswordHash"];

        var valid = false;
        if (string.IsNullOrEmpty(passwordHash))
        {
            // Dev fallback: no hash configured, accept admin / admin123
            valid = string.Equals(request.Username, adminUsername, StringComparison.OrdinalIgnoreCase)
                    && request.Password == "admin123";
        }
        else
        {
            valid = string.Equals(request.Username, adminUsername, StringComparison.OrdinalIgnoreCase)
                    && BCrypt.Net.BCrypt.Verify(request.Password, passwordHash);
        }

        if (!valid)
            return Unauthorized(new { message = "Invalid username or password." });

        var secret = _config["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret not configured.");
        var issuer = _config["Jwt:Issuer"] ?? "VenueApi";
        var audience = _config["Jwt:Audience"] ?? "VenueAdmin";
        var expMinutes = int.TryParse(_config["Jwt:ExpirationMinutes"], out var m) ? m : 60;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(expMinutes);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, request.Username),
            new Claim(JwtRegisteredClaimNames.Sub, request.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return Ok(new { token = tokenString, expiresAt = expires });
    }
}

public record LoginRequest(string Username, string Password);
