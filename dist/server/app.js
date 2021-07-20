"use strict";
const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config({ path: path.join(__dirname, '.env') });
app.use(express.static(path.join(__dirname, '../public')));
const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Running app.js'));
