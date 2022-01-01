using FinancialForecast.MVC.Models;
using System;
using System.Linq;

namespace FinancialForecast.MVC.Data
{
    public class DbInitializer
    {
        public static void Initialize(FinancialForecastDBContext context)
        {
            context.Database.EnsureCreated();

            //var Users = new User[]
            //{
            //    new User{ID=1, FirstName="Devin", LastName = "Harness", Password = "prism", UserName="legendary7803"}
            //};

            //foreach (User u in Users)
            //{
            //    context.Users.Add(u);

            //}
            //context.SaveChanges();

            // Look for any Deposits.
            if (context.Deposits.Any())
            {
                return;   // DB has been seeded
            }

            var Deposits = new Deposit[]
            {
            new Deposit{Description="PayCheck",Amount=2319,Date=DateTime.Parse("2021-12-03"), Active=true, isRecurring = true, Frequency = 14, UserRefID=1},
            };
            foreach (Deposit s in Deposits)
            {
                context.Deposits.Add(s);
            }
            context.SaveChanges();

            var Withdrawals = new Withdrawal[]
            {
            new Withdrawal{Description="Mazda",Amount=-655,Date=DateTime.Parse("2021-12-03"), Active=true, isRecurring = true, Frequency = 14, UserRefID=1},
            };
            foreach (Withdrawal c in Withdrawals)
            {
                context.Withdrawals.Add(c);
            }
            context.SaveChanges();


            var Periods = new Period[]
            {
            new Period{StartDate=DateTime.Parse("2021-12-03"),EndDate=DateTime.Parse("2021-12-16"),StartAmount=7266, FinalAmount = 5856, UserRefID=1},
            };
            foreach (Period e in Periods)
            {
                context.Periods.Add(e);
            }
            context.SaveChanges();


        }
    }
}
