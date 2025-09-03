import express from "express";
import {createGig,deleteGig,getGig,getGigs,updateGigStatus} from '../controller/gig.controller.js';
import {verifyToken} from '../middelware/jwt.js'
const router =express.Router();
router.post('/',verifyToken,createGig);
router.delete('/:id',verifyToken,deleteGig);
router.get('/single/:id',getGig);
router.get('/',getGigs);
router.patch('/:gigId/status',verifyToken,updateGigStatus);
router.patch('/:id',verifyToken, async (req,res,next)=>{
  try{
    const Gig = (await import('../models/gig.model.js')).default;
    const gig = await Gig.findById(req.params.id);
    if(!gig) return res.status(404).send('Gig not found');
    if(String(gig.userId)!==String(req.userId)) return res.status(403).send('Forbidden');
    const updatable = ['title','cat','cover','images','desc','deliveryTime','priceMin','priceMax'];
    const payload = {};
    updatable.forEach(k=>{ if(req.body[k]!==undefined) payload[k]=req.body[k]; });
    const updated = await Gig.findByIdAndUpdate(req.params.id, payload, {new:true});
    res.status(200).json(updated);
  }catch(err){ next(err); }
});
export default router;