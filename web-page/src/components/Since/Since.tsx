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
    IconButton, Paper,
    Typography
} from '@mui/material';
import {DataGrid, GridCellValue, GridColDef} from '@mui/x-data-grid';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import RefreshIcon from '@mui/icons-material/Refresh';

import {ListSince, ResetAllSince, ResetSince, SinceArrayType} from '../../api/sinceAPI';

function Since() {
    const [sinceData, setSinceData] = useState<SinceArrayType>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [resetTarget, setResetTarget] = useState<string | null>('');
    const [resetOpen, setResetOpen] = useState<boolean>(false);

    const sinceColumns: GridColDef[] = [
        { field: 'id', hide: true },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'since', headerName: 'Since Index', flex: 1 },
        {
            field: 'reset', headerName: 'Reset', width: 80,
            sortable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <IconButton
                    onClick={() => {handleResetOpen(params.getValue(params.id, 'name'))}}
                    color='error'
                    aria-label='reset-since'
                >
                    <RestartAltIcon />
                </IconButton>
            )
        }
    ]

    const handleResetOpen = (sinceName: GridCellValue | null) => {
        if (sinceName === null) {
            setResetTarget(null);
        } else if (typeof sinceName === 'string') {
            setResetTarget(sinceName);
        }
        setResetOpen(true);
    }

    const handleResetClose = () => {
        setResetOpen(false);
    }

    const handleReset = () => {
        setResetOpen(false);
        if (resetTarget === null) {
            ResetAllSince().then(value => {
                alert(value);
            })
        } else if (resetTarget !== '') {
            ResetSince(resetTarget).then(value => {
                alert(value);
            })
        } else {
            alert('empty name')
        }
    }

    const handleRefresh = () => {
        setLoading(true);
        ListSince().then(value => {
            setSinceData(value);
            setLoading(false);
        })
    }

    useEffect(() => {
        setLoading(true);
        ListSince().then(value => {
            setSinceData(value);
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
                            <Grid item lg={10} md={10} sm={10} xs={10} sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            >
                                <Typography sx={{ml: 1}} variant='h5'>Since 리스트</Typography>
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2} sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                flexDirection: 'row',
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
                                    onClick={() => {handleResetOpen(null)}}
                                    sx={{ height: '100%'}}
                                >
                                    전체리셋
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
                            rows={sinceData}
                            columns={sinceColumns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <Dialog
                open={resetOpen}
                onClose={handleResetClose}
            >
                <DialogTitle id='reset-dialog'>
                    {'Reset Since'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='reset-dialog-description'>
                        {resetTarget === null ? '모든 since' : resetTarget}을(를) 정말로 리셋하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReset}>예</Button>
                    <Button onClick={handleResetClose}>아니오</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Since;