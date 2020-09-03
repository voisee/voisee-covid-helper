import React, { useState, useEffect, useMemo } from 'react'
import RefreshIcon from '@material-ui/icons/Refresh'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'

import { RootProps } from 'model/type'
import { getRootProperties, refreshNote } from 'network'
import Sidebar from 'components/Sidebar'
import RecordCard from 'components/RecordCard'
import ChatBox from 'components/ChatBox'
import AddRecordFormDialog from './AddRecordFormDialog'
import { Container, DashboardContainer, DashboardItem, Row } from './style'

const useStyles = makeStyles((theme) => ({
  flex3: {
    flex: 3,
  },
  flex7: {
    flex: 7,
  },
  right: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttons: {
    '&>button': {
      marginRight: 12,
    },
  },
  recordList: {
    paddingRight: 30,
    overflow: 'scroll',
  },
}))

const Home: React.FC = () => {
  const classes = useStyles()
  const [notes, setNotes] = useState<RootProps[]>([])
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number>(0)
  const selectedNoteId = useMemo(
    () => notes[selectedNoteIndex]?.id,
    [notes, selectedNoteIndex],
  )

  useEffect(() => {
    getRootProperties().then((response) => {
      const { data } = response
      console.log(data)
      setNotes(data.sort((a, b) => b.id - a.id))
    })
  }, [])

  const handleSelectNote = (id: number) => {
    const newSelectedNoteIndex = notes.findIndex((note) => note.id === id)
    const selectedNote = notes[newSelectedNoteIndex]
    setSelectedNoteIndex(newSelectedNoteIndex)

    if(selectedNote?.contents?.length <= 0) {
      refreshNote(selectedNote.jobName).then((response) => {
        const newNotes = notes
        newNotes[newSelectedNoteIndex].contents = response.data.contents
        setNotes(newNotes)
      })
    }
  }

  const handleCreateNote = (note: RootProps) => {
    const newNotes = [
      note,
      ...notes,
    ]
    setNotes(newNotes)
  }

  return (
    <Container>
      <Sidebar />
      <DashboardContainer>
        <DashboardItem className={classes.flex3}>
          <Row>
            <h3>녹음파일 목록</h3>
          </Row>
          <div className={classes.recordList}>
            {notes.map((note) => (
              <RecordCard
                key={note.id}
                id={note.id}
                active={note.id === selectedNoteId}
                title={note.name}
                desc={note.description}
                onClick={handleSelectNote}
              />
            ))}
          </div>
        </DashboardItem>

        <DashboardItem className={classes.flex7}>
          <Row className={[classes.right, classes.buttons].join(' ')}>
            <AddRecordFormDialog onSuccess={handleCreateNote} />
            <Fab color="default" aria-label="refresh">
              <RefreshIcon />
            </Fab>
          </Row>
          <ChatBox note={notes[selectedNoteIndex]} />
        </DashboardItem>
      </DashboardContainer>
    </Container>
  )
}

export default Home
