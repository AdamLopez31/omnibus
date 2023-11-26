using API.Data;
using API.Entities;
using API.Middleware;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container. DEPENDENCY INJECTION CONTAINER

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
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
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

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
    app.UseSwaggerUI();
}


app.UseCors(opt => {
    //request header from client to server
    //allow credentials allows client to pass cookies backwards and forwards from our api server
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});
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
