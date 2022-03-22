using FinancialForecast.MVC.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Data.Entity;
using Microsoft.EntityFrameworkCore.Storage;
//using System.Web.Http;

namespace FinancialForecast.MVC.API
{
    public class DepositsController : FinancialForecastController
    {
        [HttpGet]
        [Route("api/deposits/all")]
        public IEnumerable<Deposit> Get()
        {
            return this.db.Deposits.Where(x => x.UserRefID == CurrentUserID).Select(u => new Deposit(u)).ToArray().OrderBy(u => u.Date);
        }

        [HttpGet]
        [Route("api/Deposits/getDepositsWithinRange/{start}/{end}")]
        public IEnumerable<Deposit> Get(String start, String end)
        {
            DateTime startDateTime = DateTime.Parse(start);
            DateTime endDateTime = DateTime.Parse(end);
            return this.db.Deposits.Where(u => u.Date >= startDateTime && u.Date <= endDateTime && u.UserRefID == CurrentUserID).Select(u => new Deposit(u)).ToArray().OrderBy(u => u.Date);
        }

        [HttpGet]
        [Route("api/deposits/getRecurringDeposits/{depositID:int}")]
        public IEnumerable<Deposit> Get(Int32 depositID, Deposit editedDeposit)
        {
            return getRecurringDeposits(depositID, editedDeposit);
        }

        [HttpPost]

        [Route("api/deposits/new")]
        public void CreateDeposit([FromBody] Deposit newDeposit)
        {
            IDbContextTransaction trans = this.db.Database.BeginTransaction();
            try
            {
                newDeposit.ID = null;
                newDeposit.UserRefID = CurrentUserID;
                newDeposit.Active = true;
                
                if (newDeposit.isRecurring)
                {                    
                    //this.db.Deposits.AddRange(newDeposits);
                    this.db.Deposits.Add(new Deposit(newDeposit));
                    newDeposit.Date = newDeposit.Date.AddDays(newDeposit.Frequency);
                    while (newDeposit.Date < newDeposit.StopDate)
                    {
                        this.db.Deposits.Add(new Deposit(newDeposit));
                        newDeposit.Date = newDeposit.Date.AddDays(newDeposit.Frequency);
                    }                    
                    this.db.SaveChanges();
                }
                else
                {
                    this.db.Deposits.Add(newDeposit);
                    this.db.SaveChanges();
                }

                trans.Commit();                

            }
            catch
            {
                trans.Rollback();
            }
        }

        [HttpPost]
        [Route("api/deposits/edit/{depositID:int}")]
        public void EditDeposit(Int32 depositID, [FromBody] Deposit editedDeposit)
        {
            Deposit original = this.db.Deposits.Where(x => x.ID == depositID).FirstOrDefault();
            original.Description = editedDeposit.Description;
            original.StopDate = editedDeposit.StopDate;
            original.Frequency = editedDeposit.Frequency;
            original.Amount = editedDeposit.Amount;
            original.isRecurring = editedDeposit.isRecurring;
            original.UserRefID = editedDeposit.UserRefID;

            this.db.SaveChanges();            
        }

        [HttpPost]
        [Route("api/deposits/multipleEdit/{depositID:int}")]
        public void EditMultipleDeposits(Int32 depositID, [FromBody] Deposit editedDeposit)
        {
            editedDeposit.ID = null;
            IEnumerable<Deposit> deposits = getRecurringDeposits(depositID, editedDeposit);
            IDbContextTransaction trans = this.db.Database.BeginTransaction();

            try
            {
                if (editedDeposit.isRecurring)
                {
                    //this.db.Deposits.AddRange(newDeposits);
                    this.db.Deposits.Add(new Deposit(editedDeposit));
                    editedDeposit.Date = editedDeposit.Date.AddDays(editedDeposit.Frequency);
                    while (editedDeposit.Date < editedDeposit.StopDate)
                    {
                        this.db.Deposits.Add(new Deposit(editedDeposit));
                        editedDeposit.Date = editedDeposit.Date.AddDays(editedDeposit.Frequency);
                    }
                    //this.db.Deposits.AddRangeAsync(newDeposits);
                    this.db.SaveChanges();
                }
                else
                {
                    this.db.Deposits.Add(editedDeposit);
                    this.db.SaveChanges();
                }

                this.db.Deposits.RemoveRange(deposits);
                this.db.SaveChanges();
                trans.Commit();
                return;

            }
            catch
            {
                trans.Rollback();
                return;
            }
        }

        [HttpPost]
        [Route("api/deposits/deleteDeposit/{depositID:int}")]
        public void DeleteDeposit(Int32 depositID)
        {
            this.db.Deposits.Remove(this.db.Deposits.Where(x => x.ID == depositID).First());
            this.db.SaveChanges();
        }

        [HttpPost]
        [Route("api/deposits/deleteMultipleDeposits/{depositID:int}")]
        public void DeleteMultipleDeposit(Int32 depositID)
        {
            Deposit original = this.db.Deposits.Where(x => x.ID == depositID).FirstOrDefault();
            List<Deposit> deposits = new List<Deposit>();
            deposits.AddRange(this.db.Deposits.Where(x => x.UserRefID == CurrentUserID && x.Description == original.Description &&
            x.Amount == original.Amount && (x.Date >= original.Date && x.Date <= original.StopDate)));

            this.db.Deposits.RemoveRange(deposits);
            this.db.SaveChanges();
        }

        [HttpGet]
        [Route("api/deposits/getDepositColumns")]
        public Deposit GetDepositColumns()
        {
            return new Deposit();
        }


        public IEnumerable<Deposit> getRecurringDeposits(Int32 depositID, Deposit editedDeposit)
        {
            Deposit original = this.db.Deposits.Where(x => x.ID == depositID).FirstOrDefault();

            IEnumerable<Deposit> recurringDeposits = this.db.Deposits.Where(x => x.UserRefID.Equals(CurrentUserID) && x.Description.Equals(original.Description) &&
               x.Amount.Equals(original.Amount) && (x.Date >= original.Date && x.Date <= original.StopDate)).OrderBy(u => u.Date);

            return recurringDeposits;
        }
    }
}
