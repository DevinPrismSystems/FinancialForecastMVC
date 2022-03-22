using FinancialForecast.MVC.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Data.Entity;
using Microsoft.EntityFrameworkCore.Storage;
using System.Globalization;

namespace FinancialForecast.MVC.API
{
    public class ForecastAPIController : FinancialForecastController
    {       

        [HttpGet]
        [Route("api/forecast/getFinancialProfile")]
        public double getFinancialInformation()
        {
            FinancialProfile profile = this.db.FinancialProfiles.Where(x => x.UserRefID == CurrentUserID).OrderByDescending(u => u.DateEntered).FirstOrDefault();
            if(profile == null)
            {
                this.db.FinancialProfiles.Add(new FinancialProfile(CurrentUserID));
                this.db.SaveChanges();
                profile = this.db.FinancialProfiles.Where(x => x.UserRefID == CurrentUserID).OrderByDescending(u => u.DateEntered).FirstOrDefault();
            }
            
            IEnumerable<Deposit> deposits = this.db.Deposits.Where(x => x.Date > profile.DateEntered && x.Date < DateTime.Now && x.Active == true && x.UserRefID == CurrentUserID).Select(x => new Deposit(x)).ToArray();            
            IEnumerable<Withdrawal> withdrawals = this.db.Withdrawals.Where(x => x.Date > profile.DateEntered && x.Date < DateTime.Now && x.Active == true && x.UserRefID == CurrentUserID).Select(x => new Withdrawal(x)).ToArray();
            
            foreach(Deposit deposit in deposits)
            {
                profile.StartAmount += deposit.Amount;
            }
            foreach(Withdrawal withdrawal in withdrawals)
            {
                profile.StartAmount -= withdrawal.Amount;
            }

            return profile.StartAmount;
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
            return this.db.Deposits.Where(u => u.Date >= start && u.Date <= end && u.UserRefID == CurrentUserID).Select(u => new Deposit(u)).ToArray().OrderBy(u => u.Date);
        }

        [HttpGet]
        [Route("api/forecast/getWithdrawals/{start}/{end}")]
        public IEnumerable<Withdrawal> GetWithdrawals(DateTime start, DateTime end)
        {
            IEnumerable<Withdrawal> withdrawals = this.db.Withdrawals.Where(u => u.Date >= start && u.Date <= end && u.UserRefID == CurrentUserID).Select(u => new Withdrawal(u)).ToArray().OrderBy(u => u.Date);
            foreach(var withdrawal in withdrawals)
            {
                withdrawal.Amount = withdrawal.Amount * (-1);
            }
            return withdrawals;
        }

        [HttpGet]
        [Route("api/forecast/getItems/{start}/{end}")]
        public IEnumerable<ForecastObject> getForecastItems(DateTime start, DateTime end)
        {
            IEnumerable<Withdrawal> withdrawals = this.db.Withdrawals.Where(u => u.Date >= start && u.Date <= end && u.UserRefID == CurrentUserID).Select(u => new Withdrawal(u)).ToArray().OrderBy(u => u.Date);
            IEnumerable<Deposit> deposits = this.db.Deposits.Where(u => u.Date >= start && u.Date <= end && u.UserRefID == CurrentUserID).Select(u => new Deposit(u)).ToArray().OrderBy(u => u.Date);
            IEnumerable<ForecastObject> forecastItems = new List<ForecastObject>();
            foreach (var withdrawal in withdrawals)
            {
                forecastItems = forecastItems.Append(new ForecastObject(withdrawal));
            }
            foreach (var deposit in deposits)
            {
                forecastItems = forecastItems.Append(new ForecastObject(deposit));
            }
            forecastItems = forecastItems.OrderBy(u => u.Date).ThenBy(x => x.Amount);
            calculateRemainingBalances(forecastItems);
            return forecastItems;
        }

        [HttpGet]
        [Route("api/forecast/getForecastColumns")]
        public ForecastObject getForecastColumns()
        {
            return new ForecastObject();
        }

        public void calculateRemainingBalances(IEnumerable<ForecastObject> items)
        {
            FinancialProfile profile = this.db.FinancialProfiles.OrderByDescending(u => u.DateEntered).First();
            ForecastObject[] pastItems = items.Where(x => x.Active == true && x.Date < profile.DateEntered).OrderByDescending(x => x.Date).ThenByDescending(x => x.Amount).ToArray();
            double startAmount = profile.StartAmount;
            for(int i = 0; i < pastItems.Length; i++)
            {
                ForecastObject item = pastItems[i];
                if(i == 0)
                {
                    item.remainingBalance = startAmount.ToString("C", CultureInfo.CurrentCulture);
                    startAmount -= (item.Amount);
                }
                else
                {
                    item.remainingBalance = (startAmount).ToString("C", CultureInfo.CurrentCulture);
                    startAmount -= (item.Amount);
                }
            }
            startAmount = profile.StartAmount;
            foreach (ForecastObject item in items.Where(x => x.Date > profile.DateEntered).OrderBy(x => x.Date))
            {
                item.remainingBalance = (startAmount + item.Amount).ToString("C", CultureInfo.CurrentCulture);
                startAmount += item.Amount;
            }
        }
    }
}
