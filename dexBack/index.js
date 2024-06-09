const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;
const axios = require("axios");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ONE_INCH_HEADERS = {
  Authorization: `Bearer ${process.env.REACT_APP_1INCH_KEY}`,
};

app.get("/tokenPrice", async (req, res) => {
  const { query } = req;

  const responseOne = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressOne,
  });

  const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressTwo,
  });

  const usdPrices = {
    tokenOne: responseOne.raw.usdPrice,
    tokenTwo: responseTwo.raw.usdPrice,
    ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
  };

  return res.status(200).json(usdPrices);
});

app.get("/allowance", async (req, res) => {
  const url = "https://api.1inch.dev/swap/v6.0/1/approve/allowance";
  const { query } = req;

  const config = {
    headers: ONE_INCH_HEADERS,
    params: {
      tokenAddress: query.tokenAddress,
      walletAddress: query.walletAddress,
    },
  };

  try {
    const response = await axios.get(url, config);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({});
  }
});

app.get("/approve", async (req, res) => {
  const url = "https://api.1inch.dev/swap/v6.0/1/approve/transaction";
  const { query } = req;

  const config = {
    headers: ONE_INCH_HEADERS,
    params: {
      tokenAddress: query.tokenAddress,
    },
  };

  try {
    const response = await axios.get(url, config);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({});
  }
});

app.get("/swap", async (req, res) => {
  const url = "https://api.1inch.dev/swap/v6.0/1/swap";
  const { query } = req;

  const config = {
    headers: ONE_INCH_HEADERS,
    params: {
      fromTokenAddress: query.fromTokenAddress,
      toTokenAddress: query.toTokenAddress,
      amount: query.amount,
      fromAddress: query.fromAddress,
      slippage: query.slippage,
    },
  };

  try {
    const response = await axios.get(url, config);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({});
  }
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
