using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    //ALL OF OUR IDENTITY CLASSES WILL USE INTEGER AS ID
    public class StoreContext : IdentityDbContext<User,Role,int>
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        //REPRESENTS TABLE IN DATABASE
        public DbSet<Product> Products {get;set;}

        //BASKETS WILL INCLUDE BASKET ITEMS
        public DbSet<Basket> Baskets { get; set; }

        public DbSet<Order> Orders {get;set;}

        //ALTERNATIVE METHOD OF SEEDING DATABASE ENTITY CONFIGURATION
        //OVERRIDE METHOD

        protected override void OnModelCreating(ModelBuilder builder)
        {
           
            base.OnModelCreating(builder);

             //THIS AREA CONFIGURE RELATIONSHIPS USING FLUENT CONFIGURATION

             builder.Entity<User>()
             .HasOne(a => a.Address)//NAVIGATION PROPERTY WE'RE INTERESTED IN
             .WithOne() //EFFECTIVELY OUR ONE TO ONE RELATIONSHIP A USER HAS ONE ADDRESS AND ADDRESS HAS 1 USER
             .HasForeignKey<UserAddress>(a => a.Id)
             .OnDelete(DeleteBehavior.Cascade);//WE WANT OUR USER ADDRESS TO BE DELETED IF WE DELETE A USER ENTITY

            builder.Entity<Role>()
            .HasData(
                new Role{Id = 1,Name = "Member", NormalizedName = "MEMBER"},
                new Role{Id = 2,Name = "Admin", NormalizedName = "ADMIN"}
            );
        }
    }
}