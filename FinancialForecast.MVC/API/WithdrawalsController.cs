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
    public class WithdrawalsController : FinancialForecastController
    {
        [HttpGet]
        [Route("api/Withdrawals/all")]
        public IEnumerable<Withdrawal> Get()
        {
            return this.db.Withdrawals.Where(x => x.UserRefID == CurrentUserID).Select(u => new Withdrawal(u)).ToArray().OrderBy(u => u.Date);
        }

        [HttpGet]
        [Route("api/Withdrawals/getWithdrawalsWithinRange/{start}/{end}")]
        public IEnumerable<Withdrawal> Get(String start, String end)
        {
            DateTime startDateTime = DateTime.Parse(start);
            DateTime endDateTime = DateTime.Parse(end);
            return this.db.Withdrawals.Where(u => u.Date >= startDateTime && u.Date <= endDateTime && u.UserRefID == CurrentUserID).Select(u => new Withdrawal(u)).ToArray().OrderBy(u => u.Date);
        }

        [HttpGet]
        [Route("api/Withdrawals/getRecurringWithdrawals/{WithdrawalID:int}")]
        public IEnumerable<Withdrawal> Get(Int32 WithdrawalID, Withdrawal editedWithdrawal)
        {
            return getRecurringWithdrawals(WithdrawalID, editedWithdrawal);
        }

        [HttpPost]

        [Route("api/Withdrawals/new")]
        public void CreateWithdrawal([FromBody] Withdrawal newWithdrawal)
        {
            IDbContextTransaction trans = this.db.Database.BeginTransaction();
            try
            {
                newWithdrawal.ID = null;
                newWithdrawal.UserRefID = CurrentUserID;
                newWithdrawal.Active = true;
                
                if (newWithdrawal.isRecurring)
                {                    
                    //this.db.Withdrawals.AddRange(newWithdrawals);
                    this.db.Withdrawals.Add(new Withdrawal(newWithdrawal));
                    newWithdrawal.Date = newWithdrawal.Date.AddDays(newWithdrawal.Frequency);
                    while (newWithdrawal.Date < newWithdrawal.StopDate)
                    {
                        this.db.Withdrawals.Add(new Withdrawal(newWithdrawal));
                        newWithdrawal.Date = newWithdrawal.Date.AddDays(newWithdrawal.Frequency);
                    }                    
                    this.db.SaveChanges();
                }
                else
                {
                    this.db.Withdrawals.Add(newWithdrawal);
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
        [Route("api/Withdrawals/edit/{WithdrawalID:int}")]
        public void EditWithdrawal(Int32 WithdrawalID, [FromBody] Withdrawal editedWithdrawal)
        {
            Withdrawal original = this.db.Withdrawals.Where(x => x.ID == WithdrawalID).FirstOrDefault();
            original.Description = editedWithdrawal.Description;
            original.StopDate = editedWithdrawal.StopDate;
            original.Frequency = editedWithdrawal.Frequency;
            original.Amount = editedWithdrawal.Amount;
            original.isRecurring = editedWithdrawal.isRecurring;
            original.UserRefID = editedWithdrawal.UserRefID;

            this.db.SaveChanges();            
        }

        [HttpPost]
        [Route("api/Withdrawals/multipleEdit/{WithdrawalID:int}")]
        public void EditMultipleWithdrawals(Int32 WithdrawalID, [FromBody] Withdrawal editedWithdrawal)
        {
            editedWithdrawal.ID = null;
            IEnumerable<Withdrawal> Withdrawals = getRecurringWithdrawals(WithdrawalID, editedWithdrawal);
            IDbContextTransaction trans = this.db.Database.BeginTransaction();

            try
            {
                if (editedWithdrawal.isRecurring)
                {
                    //this.db.Withdrawals.AddRange(newWithdrawals);
                    this.db.Withdrawals.Add(new Withdrawal(editedWithdrawal));
                    editedWithdrawal.Date = editedWithdrawal.Date.AddDays(editedWithdrawal.Frequency);
                    while (editedWithdrawal.Date < editedWithdrawal.StopDate)
                    {
                        this.db.Withdrawals.Add(new Withdrawal(editedWithdrawal));
                        editedWithdrawal.Date = editedWithdrawal.Date.AddDays(editedWithdrawal.Frequency);
                    }
                    //this.db.Withdrawals.AddRangeAsync(newWithdrawals);
                    this.db.SaveChanges();
                }
                else
                {
                    this.db.Withdrawals.Add(editedWithdrawal);
                    this.db.SaveChanges();
                }

                this.db.Withdrawals.RemoveRange(Withdrawals);
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
        [Route("api/Withdrawals/deleteWithdrawal/{WithdrawalID:int}")]
        public void DeleteWithdrawal(Int32 WithdrawalID)
        {
            this.db.Withdrawals.Remove(this.db.Withdrawals.Where(x => x.ID == WithdrawalID).First());
            this.db.SaveChanges();
        }

        [HttpPost]
        [Route("api/Withdrawals/deleteMultipleWithdrawals/{WithdrawalID:int}")]
        public void DeleteMultipleWithdrawal(Int32 WithdrawalID)
        {
            Withdrawal original = this.db.Withdrawals.Where(x => x.ID == WithdrawalID).FirstOrDefault();
            List<Withdrawal> Withdrawals = new List<Withdrawal>();
            Withdrawals.AddRange(this.db.Withdrawals.Where(x => x.UserRefID == CurrentUserID && x.Description == original.Description &&
            x.Amount == original.Amount && (x.Date >= original.Date && x.Date <= original.StopDate)));

            this.db.Withdrawals.RemoveRange(Withdrawals);
            this.db.SaveChanges();
        }

        [HttpGet]
        [Route("api/Withdrawals/getWithdrawalColumns")]
        public Withdrawal GetWithdrawalColumns()
        {
            return new Withdrawal();
        }


        public IEnumerable<Withdrawal> getRecurringWithdrawals(Int32 WithdrawalID, Withdrawal editedWithdrawal)
        {
            Withdrawal original = this.db.Withdrawals.Where(x => x.ID == WithdrawalID).FirstOrDefault();

            IEnumerable<Withdrawal> recurringWithdrawals = this.db.Withdrawals.Where(x => x.UserRefID.Equals(CurrentUserID) && x.Description.Equals(original.Description) &&
               x.Amount.Equals(original.Amount) && (x.Date >= original.Date && x.Date <= original.StopDate)).OrderBy(u => u.Date);

            return recurringWithdrawals;
        }
    }
}
