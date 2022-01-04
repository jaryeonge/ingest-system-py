import React, {useEffect, useState} from 'react';
import {
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Paper, Toolbar,
    Typography
} from '@mui/material';
import {DataGrid, GridCellValue, GridColDef} from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

import {configWithStatusArrayType, ListConfigWithStatus} from '../../api/configAPI';
import {StartAllProcess, StartProcess, StopAllProcess, StopProcess} from '../../api/processAPI';
import {TestProcess} from '../../api/testAPI';
import RefreshIcon from '@mui/icons-material/Refresh';

function Process() {
    const [configData, setConfigData] = useState<configWithStatusArrayType>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [startOpen, setStartOpen] = useState<boolean>(false);
    const [stopOpen, setStopOpen] = useState<boolean>(false);
    const [testOpen, setTestOpen] = useState<boolean>(false);

    const [startTarget, setStartTarget] = useState<string | null>('');
    const [stopTarget, setStopTarget] = useState<string | null>('');

    const [testResult, setTestResult] = useState<Array<string>>([]);
    const [testLoading, setTestLoading] = useState<boolean>(true);

    const configColumns: GridColDef[] = [
        { field: 'id', hide: true },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'cron', headerName: 'Cron', flex: 1 },
        { field: 'input_type', headerName: 'Input type', flex: 1 },
        { field: 'input_uri', headerName: 'Input uri', flex: 1 },
        { field: 'output_type', headerName: 'Output type', flex: 1 },
        { field: 'output_uri', headerName: 'Output uri', flex: 1 },
        { field: 'status', headerName: 'status', width: 100 },
        {
            field: 'start', headerName: 'Start', width: 80,
            sortable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <IconButton
                    onClick={() => {handleStartOpen(params.getValue(params.id, 'name'))}}
                    color='success'
                    aria-label='start-process'
                >
                    <PlayArrowIcon />
                </IconButton>
            )
        },
        {
            field: 'stop', headerName: 'Stop', width: 80,
            sortable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <IconButton
                    onClick={() => {handleStopOpen(params.getValue(params.id, 'name'))}}
                    color='error'
                    aria-label='stop-process'
                >
                    <StopIcon />
                </IconButton>
            )
        },
        {
            field: 'test', headerName: 'Test', width: 80,
            sortable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <IconButton
                    onClick={() => {handleTestOpen(params.getValue(params.id, 'name'))}}
                    aria-label='test-process'
                >
                    <ManageSearchIcon />
                </IconButton>
            )
        }
    ]

    const handleStartOpen = (configName: GridCellValue | null) => {
        if (configName === null) {
            setStartTarget(null);
        } else if (typeof configName === 'string') {
            setStartTarget(configName);
        }
        setStartOpen(true);
    }

    const handleStartClose = () => {
        setStartOpen(false);
    }

    const handleStart = () => {
        setStartOpen(false);
        if (startTarget === null) {
            StartAllProcess().then(value => {
                alert(value);
            })
        } else if (startTarget !== '') {
            StartProcess(startTarget).then(value => {
                alert(value);
            })
        } else {
            alert('empty name')
        }
    }

    const handleStopOpen = (configName: GridCellValue | []) => {
        if (configName === null) {
            setStopTarget(null);
        } else if (typeof configName === 'string') {
            setStopTarget(configName);
        }
        setStopOpen(true);
    }

    const handleStopClose = () => {
        setStopOpen(false);
    }

    const handleStop = () => {
        setStopOpen(false);
        if (stopTarget === null) {
            StopAllProcess().then(value => {
                alert(value);
            })
        } else if (stopTarget !== '') {
            StopProcess(stopTarget).then(value => {
                alert(value);
            })
        } else {
            alert('empty name')
        }
    }

    const handleTestOpen = (configName: GridCellValue) => {
        if (typeof configName === 'string') {
            setTestLoading(true);
            setTestOpen(true);
            TestProcess(configName).then(value => {
                if (Array.isArray(value)) {
                    setTestResult(value);
                    setTestLoading(false);
                } else {
                    alert(value);
                    setTestLoading(false);
                }
            })
        }
    }

    const handleTestClose = () => {
        setTestOpen(false);
    }

    const handleRefresh = () => {
        setLoading(true);
        ListConfigWithStatus().then(value => {
            setConfigData(value);
            setLoading(false);
        })
    }

    useEffect(() => {
        setLoading(true);
        ListConfigWithStatus().then(value => {
            setConfigData(value);
            setLoading(false);
        })
    }, [])

    if (loading) return (
        <Container maxWidth='xl' sx={{
            mt: 10, mb: 2, height: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <CircularProgress size={700}/>
        </Container>
    );

    return (
        <Container maxWidth='xl' sx={{ mt: 10, mb: 2 }}>
            <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}
                      sx={{
                          p: 0,
                          display: 'flex',
                          flexDirection: 'row',
                          height: '10%',
                      }}
                >
                    <Paper
                        sx={{
                            p: 1,
                            display: 'flex',
                            width: '100%',
                        }}
                    >
                        <Grid container spacing={1}>
                            <Grid item lg={9} md={9} sm={9} xs={9} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography sx={{ml: 1}} variant='h5'>프로세스 리스트</Typography>
                            </Grid>
                            <Grid item lg={3} md={3} sm={3} xs={3} sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <IconButton
                                    onClick={handleRefresh}
                                    aria-label='refresh'
                                >
                                    <RefreshIcon/>
                                </IconButton>
                                <Button
                                    variant='contained'
                                    onClick={() => {handleStartOpen(null)}}
                                    sx={{ height: '100%'}}
                                >
                                    전체시작
                                </Button>
                                <Button
                                    variant='outlined'
                                    onClick={() => {handleStopOpen(null)}}
                                    sx={{ height: '100%'}}
                                >
                                    전체중지
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}
                      sx={{
                          p: 0,
                          display: 'flex',
                          flexDirection: 'row',
                          height: '90%',
                      }}
                >
                    <Paper
                        sx={{
                            p: 1,
                            display: 'flex',
                            height: 650,
                            width: '100%',
                        }}
                    >
                        <DataGrid
                            rows={configData}
                            columns={configColumns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <Dialog
                open={startOpen}
                onClose={handleStartClose}
            >
                <DialogTitle id='start-dialog'>
                    {'Start Process'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='start-dialog-description'>
                        {startTarget === null ? '모든 프로세스' : startTarget}을(를) 정말로 실행하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStart}>예</Button>
                    <Button onClick={handleStartClose}>아니오</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={stopOpen}
                onClose={handleStopClose}
            >
                <DialogTitle id='stop-dialog'>
                    {'Stop Process'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='stop-dialog-description'>
                        {stopTarget === null ? '모든 프로세스' : stopTarget}을(를) 정말로 중지하시겠습니까?
                   </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStop}>예</Button>
                    <Button onClick={handleStopClose}>아니오</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={testOpen}
                onClose={handleTestClose}
            >
                <Toolbar>
                    <IconButton
                        edge='start'
                        color='error'
                        onClick={handleTestClose}
                        aria-label='close'
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant='h5'>테스트 결과</Typography>
                </Toolbar>
                {testLoading
                ?   <Container maxWidth='xl' sx={{
                        height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <CircularProgress size={100}/>
                    </Container>
                :   <Paper
                        sx={{
                            p: 2,
                            overflow: 'auto',
                        }}
                    >
                        {testResult.map((value) =>
                            value + '\n'
                        )}
                    </Paper>
                }

            </Dialog>
        </Container>
    );
}

export default Process;