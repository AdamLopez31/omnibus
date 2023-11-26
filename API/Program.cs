using System.Text;
using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container. DEPENDENCY INJECTION CONTAINER

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put Bearer + your token in box below",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            jwtSecurityScheme,Array.Empty<string>()
        }
    });
});






builder.Services.AddDbContext<StoreContext>(opt => {
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();

//CONFIGURATION FOR IDENTITY
builder.Services.AddIdentityCore<User>(opt => {
    //prevent duplicate emails in database
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<StoreContext>();//GIVES US TABLES FOR USERS AND ROLES

//SERVICES FOR AUTHENTICATION AND AUTHORIZATION
//USERS ARE GOING TO PRESENT TOKEN INSIDE OF AN AUTHORIZATION HEADER IN THE HTTP REQUEST
//AND THEN OUR SERVICE WILL CHECK THAT FOR IT'S VALIDITY
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(opt => {
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        //SERVER CHECK FOR VALIDITY OF TOKEN
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
    };
});
builder.Services.AddAuthorization();

//OWN SERVICE WE CREATED SCOPE OF ENTIRE LIFETIME OF HTTP REQUEST SERVICE WILL BE KEPT ALIVE WHILE HTTP REQUEST IS BEING PROCESSED
//ONCE FINISHED TOKEN SERVICE WILL BE DISPOSED OF NOW ABLE TO INJENCT INTO OTHER CLASSES
builder.Services.AddScoped<TokenService>();


var app = builder.Build();






//MIDDLEWARE ORDERING IS IMPORTANT
// Configure the HTTP request pipeline. AS REQUEST COMES INTO API AND GOES OUT AS RESPONSE
// HTTP request pipeline IS WHAT IS BETWEEN MIDDLEWARE DO SOMETHING WITH REQUEST

//ERROR HANDLING MUST GO TO TOP OF MIDDLEWARE REQUEST PIPELINE
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    //MAKE SWAGGER AVAILABLE IN DEVELOPMENT MODE
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        //PERSIST TOKEN IN SWAGGER
        c.ConfigObject.AdditionalItems.Add("persistAuthorization",true);
    });
}


app.UseCors(opt => {
    //request header from client to server
    //allow credentials allows client to pass cookies backwards and forwards from our api server
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});
app.UseAuthentication();
app.UseAuthorization();

//MIDDLEWARE TO MAP CONTROLLERS
app.MapControllers();

var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

//FOR ERRORS
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    //IF DATABASE ALREADY EXIST THIS CODE DOESN'T DO ANYTHING
    //CREATES DATABASE AND APPLIES ANY PENDING MIGRATIONS
    await context.Database.MigrateAsync();

    //DBINITIALIZER IS STATIC SO NO NEED TO CREATE INSTANCE OF CLASS
    await DbInitializer.Initialize(context,userManager);
}
catch (System.Exception ex)
{
    logger.LogError(ex, "A problem occurred during migration");
}

app.Run();
