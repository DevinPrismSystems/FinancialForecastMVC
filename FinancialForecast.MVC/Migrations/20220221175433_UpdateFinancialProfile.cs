using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinancialForecast.MVC.Migrations
{
    public partial class UpdateFinancialProfile : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "FinancialProfile",
                newName: "UserRefID");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateEntered",
                table: "FinancialProfile",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateEntered",
                table: "FinancialProfile");

            migrationBuilder.RenameColumn(
                name: "UserRefID",
                table: "FinancialProfile",
                newName: "UserID");
        }
    }
}
