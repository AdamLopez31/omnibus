using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User>
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        //REPRESENTS TABLE IN DATABASE
        public DbSet<Product> Products {get;set;}

        //BASKETS WILL INCLUDE BASKET ITEMS
        public DbSet<Basket> Baskets { get; set; }

        //ALTERNATIVE METHOD OF SEEDING DATABASE ENTITY CONFIGURATION
        //OVERRIDE METHOD

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole{Name = "Member", NormalizedName = "MEMBER"},
                new IdentityRole{Name = "Admin", NormalizedName = "ADMIN"}
            );
        }
    }
}