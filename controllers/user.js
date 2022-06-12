const path = require('path');
const fs = require('fs');

const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

exports.getUserImage = (req, res, next) => {
    console.log(req.user);



    return req.user.id;
}