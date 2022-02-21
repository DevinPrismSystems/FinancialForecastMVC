using FinancialForecast.MVC.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Data.Entity;
using Microsoft.EntityFrameworkCore.Storage;

namespace FinancialForecast.MVC.API
{
    public class ForecastAPIController : FinancialForecastController
    {
        [HttpGet]
        [Route("api/forecast/getFinancialProfile")]
        public double getFinancialInformation()
        {
            return this.db.FinancialProfiles.OrderByDescending(u => u.DateEntered).Select(u => u.StartAmount).First();
        }

        [HttpPost]
        [Route("api/forecast/updateFinancialProfile/{startAmount}")]
        public void updateFinancialInformation(double startAmount)
        {
            FinancialProfile profile = this.db.FinancialProfiles.Where(x => x.UserRefID == CurrentUserID).First();
            profile.DateEntered = DateTime.Now;
            profile.StartAmount = startAmount;
            this.db.SaveChanges();
        }

        [HttpGet]
        [Route("api/forecast/getDeposits/{start}/{end}")]
        public IEnumerable<Deposit> GetDeposits(DateTime start, DateTime end)
        {
            return this.db.Deposits.Where(u => u.Date >= start && u.Date <= end).Select(u => new Deposit(u)).ToArray().OrderBy(u => u.Date);
        }

        [HttpGet]
        [Route("api/forecast/getWithdrawals/{start}/{end}")]
        public IEnumerable<Withdrawal> GetWithdrawals(DateTime start, DateTime end)
        {
            IEnumerable<Withdrawal> withdrawals = this.db.Withdrawals.Where(u => u.Date >= start && u.Date <= end).Select(u => new Withdrawal(u)).ToArray().OrderBy(u => u.Date);
            foreach(var withdrawal in withdrawals)
            {
                withdrawal.Amount = withdrawal.Amount * (-1);
            }
            return withdrawals;
        }


        [HttpGet]
        [Route("api/forecast/getForecastColumns")]
        public Deposit getForecastColumns()
        {
            return new Deposit();
        }
    }
}
