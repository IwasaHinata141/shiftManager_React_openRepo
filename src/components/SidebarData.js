import React from 'react'
import PostAddIcon from '@mui/icons-material/PostAdd';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AddBoxIcon from '@mui/icons-material/AddBox';



export const SidebarData = [
  {
    title:"メンバー管理",
    icon:<ChecklistIcon />,
    link:"/"
  },
  {
    title:"シフト管理",
    icon:<PostAddIcon />,
    link:"/shift",
  },
  {
    title:"新規グループ作成",
    icon:<AddBoxIcon />,
    link:"/creategroup"
  },
]

