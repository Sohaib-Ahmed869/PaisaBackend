const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Advertisement = require('../models/Advertisement');
const Voucher = require('../models/Voucher');
const Website = require('../models/Website');
const SocialMedia = require('../models/SocialMedia');
const app = express();

//-----------------------------ADMIN--------------------------------------------

// add admin
router.post('/addAdmin', async (req, res) => {
    try {
        const { name, email, password, dob } = req.body;
        // You can add additional validation if needed

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = {
            name,
            email,
            password: hashedPassword,
            dob,
            
        };

        const admin = new Admin(newAdmin);

        // Save the admin to the database
        await admin.save();

        return res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
        
    }
}
);

// block admin
router.post('/blockAdmin', async (req, res) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({ email: email });

        if (admin) {
            admin.block = true;
            await admin.save();
            return res.status(200).json({ message: 'Admin blocked successfully' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
);

// unblock admin
router.post('/unblockAdmin', async (req, res) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({ email: email });

        if (admin) {
            admin.block = false;
            await admin.save();
            return res.status(200).json({ message: 'Admin unblocked successfully' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    
    }
}
);

// view all admins
router.get('/viewAllAdmins', async (req, res) => {
    try {
        const admins = await Admin.find({});

        res.status(200).json({ admins });
    } catch (error) {
        console.log(error);
    }
}
);

// view one admin
router.get('/viewAdmin', async (req, res) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({ email: email });

        res.status(200).json({ admin });
    } catch (error) {
        console.log(error);
    }
}
);

// view all blocked admins
router.get('/viewBlockedAdmins', async (req, res) => {
    try {
        const admins = await Admin.find({ block: true });

        res.status(200).json({ admins });
    } catch (error) {
        console.log(error);
    }
}
);


//-----------------------------ADVERTISEMENT--------------------------------------------

// add advertisement
router.post('/addAdvertisement', async (req, res) => {
    try {
        const file = req.files.file;
        const fileName = file.name;
        const fileSize = file.data.length;
        const extension = path.extname(fileName);
        const allowedExtensions = /png|jpg|jpeg|pdf/;
        const md5 = file.md5;
        const dbPath = '/images/advertisement/' + md5 + extension;

        if (!allowedExtensions.test(extension)) {
            return res.status(400).send('Invalid extension.');
        }
        await util.promisify(file.mv)('./uploads/' + md5 + extension);
        res.send({ fileName, fileSize, URL });
        const newAdvertisement = {
            name: req.body.name,
            image: dbPath
        };

        const advertisement = new Advertisement(newAdvertisement);

        await advertisement.save();

    } catch (error) {
        console.log(error);
    }
}
);

// view all advertisements
router.get('/viewAllAdvertisements', async (req, res) => {
    try {
        const advertisements = await Advertisement.find({});

        res.status(200).json({ advertisements });
    } catch (error) {
        console.log(error);
    }
}
);

// view one advertisement
router.get('/viewAdvertisement', async (req, res) => {
    try {
        const { name } = req.body;

        const advertisement = await Advertisement.findOne({ name: name });

        res.status(200).json({ advertisement });
    } catch (error) {
        console.log(error);
    }
}
);

// delete advertisement
router.post('/deleteAdvertisement', async (req, res) => {
    try {
        const { name } = req.body;

        const advertisement = await Advertisement.findOne({ name: name });

        if (advertisement) {
            await advertisement.delete();
        }

    } catch (error) {
        console.log(error);
    }
}
);

//get a random advertisement
router.get('/getRandomAdvertisement', async (req, res) => {
    try {
        const advertisements = await Advertisement.find({});

        const random = Math.floor(Math.random() * advertisements.length);

        res.status(200).json({ advertisement: advertisements[random] });
    } catch (error) {
        console.log(error);
    }
}
);



//-----------------------------VOUCHER--------------------------------------------
// add voucher
router.post('/addVoucher', async (req, res) => {
    try {
        const { voucher_code, is_used, discount, expiry_date } = req.body;

        const newVoucher = {
            voucher_code,
            is_used,
            discount,
            expiry_date
        };

        const voucher = new Voucher(newVoucher);

        await voucher.save();

        return res.status(201).json({ message: 'Voucher added successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
);

// view all vouchers
router.get('/viewAllVouchers', async (req, res) => {
    try {
        const vouchers = await Voucher.find({});

        res.status(200).json({ vouchers });
    } catch (error) {
        console.log(error);
    }
}
);

// view one voucher
router.get('/viewVoucher', async (req, res) => {
    try {
        const { voucher_code } = req.body;

        const Vouch = await Voucher.findOne({ voucher_code: voucher_code });

        res.status(200).json({ Vouch });

    } catch (error) {
        console.log(error);

    }
}
);

// set voucher as used
router.post('/setVoucherAsUsed', async (req, res) => {
    try {
        const { voucher_code } = req.body;

        const voucher = await  Voucher.findOne({ voucher_code: voucher_code });

        if (voucher) {
            voucher.is_used = true;
            await voucher.save();
            return res.status(200).json({ message: 'Voucher set to used' });
        }

    } catch (error) {
        console.log(error);
    }
}
);

// delete voucher
router.delete('/deleteVoucher', async (req, res) => {
    try {
        const { voucher_code } = req.body;

        const voucher_new = await Voucher.findOne({ voucher_code: voucher_code });

        if (voucher_new) {
            await Voucher.deleteOne({ voucher_code: voucher_code });

            return res.status(200).json({ message: 'Voucher deleted successfully' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
);
//get a random voucher
router.get('/getRandomVoucher', async (req, res) => {
    try {
        const vouchers = await Voucher.find({});

        const random = await Math.floor(Math.random() * vouchers.length);

        res.status(200).json({ voucher: vouchers[random] });
    } catch (error) {
        console.log(error);
    }
}
);

//-----------------------------WEBSITE--------------------------------------------

//update gst
router.put('/updateGST', async (req, res) => {
    try {
        const { gst } = req.body;

        const website = await Website.findOne({});

        if (website) {
            website.gst = gst;
            await website.save();
        }

    } catch (error) {
        console.log(error);
    }
}

);

//update standard_shipping
router.put('/updateStandardShipping', async (req, res) => {
    try {
        const { standard_shipping } = req.body;

        const website = await Website.findOne({});

        if (website) {
            website.standard_shipping = standard_shipping;
            await website.save();
        }

    } catch (error) {
        console.log(error);
    }
}

);

//update express_shipping
router.put('/updateExpressShipping', async (req, res) => {
    try {
        const { express_shipping } = req.body;

        const website = await Website.findOne({});

        if (website) {
            website.express_shipping = express_shipping;
            await website.save();
        }

    } catch (error) {
        console.log(error);
    }
}

);

//-----------------------------SOCIAL MEDIA--------------------------------------------

//add social media
//use file upload for icon
router.post('/addSocialMedia', async (req, res) => {
    try {
        const file = req.files.file;
        const site = req.body.site;
        const link = req.body.link;
        const extension = path.extname(file.name);
        const newFileName = site + extension;
        const uploadPath = path.join(__dirname, '../public/images/socialMedia', newFileName);
        const dbPath = '/images/socialMedia/' + newFileName;

        file.mv(uploadPath, async (error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error uploading file' });
            }
        }

        );

        const newSocialMedia = {
            site,
            link,
            icon: dbPath
        };

        const socialMedia = new SocialMedia(newSocialMedia);

        await socialMedia.save();

    } catch (error) {
        console.log(error);
    }
}
);


// view all social media
router.get('/viewAllSocialMedia', async (req, res) => {
    try {
        const socialMedia = await SocialMedia.find({});

        res.status(200).json({ socialMedia });
    } catch (error) {
        console.log(error);
    }
}
);

// delete social media
router.delete('/deleteSocialMedia', async (req, res) => {
    try {
        const { site } = req.body;

        const socialMedia = await SocialMedia.findOne({ site: site });

        if (socialMedia) {
            await socialMedia.delete();
        }

    } catch (error) {
        console.log(error);
    }
}

);

//update social media
router.put('/updateSocialMedia', async (req, res) => {
    try {
        const { site, link } = req.body;

        const socialMedia = await SocialMedia.findOne({ site: site });

        if (socialMedia) {
            socialMedia.link = link;
            await socialMedia.save();
        }

    } catch (error) {
        console.log(error);
    }
}

);

// update social media icon

router.put('/updateSocialMediaIcon', async (req, res) => {
    try {
        const file = req.files.file;
        const site = req.body.site;
        const extension = path.extname(file.name);
        const newFileName = site + extension;
        const uploadPath = path.join(__dirname, '../public/images/socialMedia', newFileName);
        const dbPath = '/images/socialMedia/' + newFileName;

        file.mv(uploadPath, async (error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error uploading file' });
            }
        }

        );

        const socialMedia = await SocialMedia.findOne({ site: site });

        if (socialMedia) {
            socialMedia.icon = dbPath;
            await socialMedia.save();
        }

    } catch (error) {
        console.log(error);
    }
}

);

module.exports = router;