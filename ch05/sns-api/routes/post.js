const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const { Post, Hashtag } = require('../models')
const { isLoggedIn } = require('./middlewares')

const router = express.Router()

// Ensure 'uploads' directory exists
try {
   fs.readdirSync('uploads')
} catch (error) {
   console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
   fs.mkdirSync('uploads')
}

// Multer configuration for image uploads
const upload = multer({
   storage: multer.diskStorage({
      destination(req, file, cb) {
         cb(null, 'uploads/')
      },
      filename(req, file, cb) {
         const ext = path.extname(file.originalname)
         cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
      },
   }),
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

// Route for image upload
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
   console.log(req.file)
   res.json({ success: true, url: `/img/${req.file.filename}` })
})

// Multer configuration for non-file data
const upload2 = multer()

// Route for creating a post
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
   try {
      console.log(req.user)
      const post = await Post.create({
         content: req.body.content,
         img: req.body.url,
         UserId: req.user.id,
      })

      // Extract hashtags from content
      const hashtags = req.body.content.match(/#[^\s#]*/g)
      if (hashtags) {
         const result = await Promise.all(
            hashtags.map((tag) =>
               Hashtag.findOrCreate({
                  where: { title: tag.slice(1).toLowerCase() },
               })
            )
         )
         await post.addHashtags(result.map((r) => r[0]))
      }

      // Respond with created post data
      res.json({
         success: true,
         post: {
            id: post.id,
            content: post.content,
            img: post.img,
            UserId: post.UserId,
         },
         message: '게시물이 성공적으로 등록되었습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: 'An error occurred.', error })
   }
})

module.exports = router
