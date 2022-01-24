using FinancialForecast.MVC.Models;
using Microsoft.EntityFrameworkCore;

namespace FinancialForecast.MVC.Data
{
    public class FinancialForecastDBContext : DbContext
    {
        public FinancialForecastDBContext(DbContextOptions<FinancialForecastDBContext> options) : base(options)
        {

        }

        public FinancialForecastDBContext(string database)
        {

        }

        public DbSet<FinancialProfile> FinancialProfiles { get; set; }
        public DbSet<Deposit> Deposits { get; set; }
        public DbSet<Withdrawal> Withdrawals { get; set; }
        public DbSet<Period> Periods { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Deposit>(entity =>
            {
                entity.HasKey(e => e.ID);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.ID).UseIdentityColumn();
                
            });

            modelBuilder.Entity<Withdrawal>(entity =>
            {
                entity.HasKey(e => e.ID);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.ID).UseIdentityColumn();
            });

            modelBuilder.Entity<Period>(entity =>
            {
                entity.HasKey(e => e.ID);
                entity.Property(e => e.UserRefID).IsRequired();
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserID);
                entity.Property(e => e.UserName).IsRequired();
                entity.Property(e => e.Password).IsRequired();

            });

            modelBuilder.Entity<FinancialProfile>(entity =>
            {
                entity.HasKey(e => e.UserID);
                entity.Property(e => e.StartAmount);
            });

            modelBuilder.Entity<Deposit>().ToTable("Deposit");
            modelBuilder.Entity<Withdrawal>().ToTable("Withdrawal");
            modelBuilder.Entity<Period>().ToTable("Period");
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<FinancialProfile>().ToTable("FinancialProfile");
        }
    }
}
