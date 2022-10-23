import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { blue, grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import { CommentItem } from "../constants/atom";
import type { CommentInfo } from "../pages/[id]/Comment";

type Props = {
  commentItem: CommentItem;
  comment: CommentInfo;
  setComment: React.Dispatch<React.SetStateAction<CommentInfo>>;
  handleCommentSubmit: () => void;
};

const CommentForm = ({
  commentItem,
  comment,
  setComment,
  handleCommentSubmit,
}: Props) => {
  return (
    <>
      <Grid item xs={8}>
        <Card
          sx={{
            maxWidth: 500,
            minWidth: 360,
            display: "flex",
            flexDirection: "column",
            mx: "auto",
            boxShadow: 0,
          }}
        >
          <Box
            sx={{
              bgcolor: blue[100],
              maxWidth: 500,
              mb: 4,
              borderRadius: 5,
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: blue[200] }}
                  src={commentItem.photoURL}
                ></Avatar>
              }
              titleTypographyProps={{ fontSize: 16 }}
              subheaderTypographyProps={{ fontSize: 16 }}
              title={commentItem.displayName}
              subheader={commentItem.createdAt}
            />
            <CardContent
              sx={{
                bgcolor: blue[50],
              }}
            >
              <Typography
                sx={{
                  minHeight: 100,
                  whiteSpace: "pre-line",
                  fontSize: 18,
                }}
                variant="body2"
                color="text.secondary"
                component="p"
              >
                {commentItem.value}
              </Typography>
            </CardContent>
            <Toolbar />
          </Box>
        </Card>

        <Box
          sx={{
            bgcolor: grey[300],
            borderRadius: 5,
            maxWidth: 500,
            height: 200,
            mx: "auto",
            mb: 4,
            pt: 5,
            pb: 4,
          }}
        >
          <Box
            sx={{ display: "flex", pt: 1, pb: 1 }}
            justifyContent="center"
            component="form"
            noValidate
            autoComplete="off"
          >
            <TextField
              sx={{
                maxWidth: 350,
                minWidth: 330,
                mx: "auto",
                bgcolor: "white",
              }}
              id="outlined-multiline-static"
              label="コメントを入力してくだい"
              multiline
              rows={4}
              size="medium"
              type="text"
              value={comment.value}
              onChange={(e) =>
                setComment({ ...comment, value: e.target.value })
              }
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 3,
            }}
          >
            <Button
              sx={{ textTransform: "none", fontSize: 18, height: 40 }}
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleCommentSubmit}
              disabled={comment.value === "" ? true : false}
            >
              Comment
            </Button>
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default CommentForm;
