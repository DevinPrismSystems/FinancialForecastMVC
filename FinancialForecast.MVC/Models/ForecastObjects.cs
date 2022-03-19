using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FinancialForecast.MVC.Models
{
    public class ForecastObject
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Nullable<int> ID { get; set; }

        [JsonPropertyName("Description")]
        public string Description { get; set; }

        [JsonPropertyName("Active")]
        public bool Active { get; set; }

        [JsonPropertyName("Date")]
        public DateTime Date { get; set; }

        [JsonPropertyName("Amount")]
        public double Amount { get; set; }

        [JsonPropertyName("Deposits")]
        public String DepositAmount { get; set; }

        [JsonPropertyName("Withdrawals/Debits")]
        public String WithdrawalAmount { get; set; }

        [ForeignKey("AspNetUsers")]
        [JsonPropertyName("UserID")]
        public String UserRefID { get; set; }

        [JsonPropertyName("Remaining Balance")]
        public string remainingBalance { get; set; }


        public ForecastObject()
        {
            this.Active = true;
            this.Date = DateTime.Now;
        }

        public ForecastObject(int iD, string description, double amount, DateTime date, bool active, bool isRecurring, DateTime stopDate, int frequency, string userRefID)
        {
            this.ID = iD;
            this.Description = description;
            this.Amount = amount;            
            this.Date = date;
            this.Active = active;
            this.UserRefID = userRefID;
        }

        public ForecastObject(Deposit deposit)
        {
            this.ID = deposit.ID;
            this.Description = deposit.Description;
            this.Amount = deposit.Amount;            
            this.DepositAmount = deposit.Amount.ToString("C", CultureInfo.CurrentCulture);
            this.Date = deposit.Date;
            this.Active = deposit.Active;
            this.UserRefID = deposit.UserRefID;
            this.Date = deposit.Date;
        }

        public ForecastObject(Withdrawal withdrawal)
        {
            this.ID = withdrawal.ID;
            this.Description = withdrawal.Description;
            this.Amount = -(withdrawal.Amount);            
            this.WithdrawalAmount = withdrawal.Amount.ToString("C", CultureInfo.CurrentCulture);
            this.Date = withdrawal.Date;
            this.Active = withdrawal.Active;
            this.UserRefID = withdrawal.UserRefID;
            this.Date = withdrawal.Date;
        }

        public class DateTimeConverter : JsonConverter<DateTime>
        {
            public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            {
                Debug.Assert(typeToConvert == typeof(DateTime));
                return DateTime.Parse(reader.GetString());
            }

            public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
            {
                //writer.WriteStringValue(value.ToUniversalTime().ToString("MM/dd/yyyy"));
                writer.WriteStringValue(value.ToUniversalTime().ToString("yyyy-MM-dd"));
            }
        }

    }


}
