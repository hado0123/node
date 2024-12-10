import { Card, CardContent, Typography, Box, CardActions, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
// import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deletePostThunk } from '../../features/postSlice'

const PostItem = ({ post }) => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const onClickDelete = (id) => {
      dispatch(deletePostThunk(id)) // Thunk로 데이터 전송
         .unwrap() // Thunk의 결과를 추출
         .then((response) => {
            alert('게시물이 성공적으로 삭제되었습니다!')
            navigate('/')
         })
         .catch((error) => {
            console.error('게시물 등록 중 오류 발생:', error)
            alert('게시물 등록에 실패했습니다.')
         })
   }
   return (
      <Card style={{ margin: '20px 0' }}>
         <CardContent>
            <img src={`http://localhost:8000${post.img}`} alt={post.content}></img>
            <Typography>@{post.User.nick}</Typography>
            <Typography>{post.createdAt}</Typography>
            <Typography>{post.content}</Typography>
         </CardContent>
         <CardActions>
            <Button size="small" color="primary">
               <FavoriteBorderIcon fontSize="small" />
            </Button>
            <Box sx={{ p: 2 }}>
               <Link to={`/posts/edit/${post.id}`}>
                  <IconButton aria-label="edit" size="small">
                     <EditIcon fontSize="small" />
                  </IconButton>
               </Link>
               <IconButton aria-label="delete" size="small" onClick={() => onClickDelete(post.id)}>
                  <DeleteIcon fontSize="small" />
               </IconButton>
            </Box>
         </CardActions>
      </Card>
   )
}

export default PostItem