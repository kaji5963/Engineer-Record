import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { useRecoilState } from "recoil";
import { recordListState } from "../constants/atom";
import { useEffect, useState } from "react";

const RecordList = () => {
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [isClient, setIsClient] = useState(false);

  //Hydrate Error対策
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {recordList.map((record) => (
            <ListItem
              key={record.key}
              disableGutters
              secondaryAction={
                <IconButton aria-label="comment">
                  <CommentIcon />
                </IconButton>
              }
            >
              <ListItemText primary={record.value} />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};

export default RecordList;
