using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace FinancialForecast.MVC.Models
{
    public class AppIdentityDbContext : IdentityDbContext
    {
        public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options) : base(options) {  }

        public DbSet<LoginViewModel> Logins { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            
        }
    }
}
