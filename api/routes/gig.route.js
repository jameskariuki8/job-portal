import express from "express";
import {createGig,deleteGig,getGig,getGigs,updateGigStatus,toggleLikeGig,getSellerStats} from '../controller/gig.controller.js';
import multer from 'multer';
const upload = multer();
import {verifyToken} from '../middelware/jwt.js'
const router =express.Router();
// Support multipart for document upload (field name: document)
router.post('/',verifyToken, upload.single('document'), createGig);
router.delete('/:id',verifyToken,deleteGig);
router.get('/single/:id',getGig);
router.get('/',getGigs);
router.patch('/:gigId/status',verifyToken,updateGigStatus);
router.post('/:id/like', verifyToken, toggleLikeGig);
// Serve document download
router.get('/:id/document', async (req,res,next)=>{
  try{
    const Gig = (await import('../models/gig.model.js')).default;
    const gig = await Gig.findById(req.params.id).select('document hasDocument title');
    if(!gig || !gig.hasDocument || !gig.document?.data) return res.status(404).send('Document not found');
    res.setHeader('Content-Type', gig.document.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${gig.document.filename||'document'}"`);
    res.send(gig.document.data);
  }catch(err){ next(err); }
});
router.get('/stats', verifyToken, getSellerStats);
router.patch('/:id',verifyToken, upload.single('document'), async (req,res,next)=>{
  try{
    const Gig = (await import('../models/gig.model.js')).default;
    const gig = await Gig.findById(req.params.id);
    if(!gig) return res.status(404).send('Gig not found');
    if(String(gig.userId)!==String(req.userId)) return res.status(403).send('Forbidden');
    const updatable = ['title','cat','cover','images','desc','deliveryTime','priceMin','priceMax','pages','pricePerPage','discountEnabled','discountAmount','discountCondition'];
    const payload = {};
    updatable.forEach(k=>{ if(req.body[k]!==undefined) payload[k]=req.body[k]; });
    if (req.file) {
      payload.document = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
        size: req.file.size,
      };
      payload.hasDocument = true;
    }
    const updated = await Gig.findByIdAndUpdate(req.params.id, payload, {new:true});
    res.status(200).json(updated);
  }catch(err){ next(err); }
});
export default router;