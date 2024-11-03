import express from "express";

const router = express.Router();

router.get( "/", (req, res) => {
    res.send( "(CtrlHost) Hello World!" );
} );

router.post( "/", (req, res) => {
    res.send( { message: "(CtrlHost) Hello World!" } );
} );

export default router;