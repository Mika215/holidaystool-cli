#!/usr/bin/env node
const axios = require("axios");
const chalk = require("chalk");
const {program} = require("commander");
const inquirer = require("inquirer");
const currentYear = new Date().getFullYear();

program
  .version("1.0.0")
  .description("Holidays generator dependency tool for countries of the world")
  .parse();

const filterCC = async () => {
  let result;
  let match = false;
  try {
    const res = await axios.get(
      "https://date.nager.at/api/v3/AvailableCountries"
    );
    const countryList = await res.data;
    for (let country of countryList) {
      if (country.name.toLowerCase() === process.argv[2].toLowerCase()) {
        result = country.countryCode;
        match = true;
        return result;
      } else {
        result = `There is no country code that matches,${chalk.red.bold(
          process.argv[2]
        )} in our data base!`;
        match = false;
      }
    }
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};

const getHolidays = async (inquiredCountry) => {
  const holidayURL = "https://date.nager.at/api/v3/PublicHolidays";
  try {
    const inquiredCC = await filterCC();
    if (inquiredCC) {
      const result = await axios.get(
        `${holidayURL}/${currentYear}/${inquiredCC}`
      );
      const displayUser = result.data;
      //Even if the user pass a country name with lowerCase this methode converts the first later into upperCase and concatinates the second slice in a lowercase
      const header = `Country Name: ${chalk.green.bold(
        inquiredCountry.charAt(0).toUpperCase() +
          inquiredCountry.slice(1).toLowerCase()
      )}\nCountry Code: ${chalk.yellow.bold(
        inquiredCC
      )}\nCurrent Year: ${chalk.green(
        currentYear
      )}\nAnnual Holidays ${chalk.green.bold("↓↓↓")}\n`;
      console.log(header);
      displayUser.forEach((element) => {
        console.log(`${chalk.yellow.bold(element.name)}\n${element.date}`);
      });
    } else {
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

const getUserInquiery = async () => {
  try {
    let inquiredCountry = process.argv[2];
    if (process.argv[3]) {
      console.log(
        chalk.yellow("Too many arguments!\nPlease enter only one country name")
      );
    } else if (!process.argv[2]) {
      console.log(chalk.red.bold("Please specify country name!"));
    } else {
      return getHolidays(inquiredCountry);
    }
  } catch (err) {
    console.error(err);
  }
};
getUserInquiery();
