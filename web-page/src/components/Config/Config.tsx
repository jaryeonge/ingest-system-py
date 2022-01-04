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
    Paper,
    Slide,
    Toolbar,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import {TransitionProps} from '@mui/material/transitions';
import {DataGrid, GridCellValue, GridColDef} from '@mui/x-data-grid';

import {configArrayType, DeleteConfig, ListConfig} from '../../api/configAPI';
import NewConfigDialog from './NewConfigDialog';
import UpdateConfigDialog from './UpdateConfigDialog';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function Config() {
    const [configData, setConfigData] = useState<configArrayType>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [deleteConfigOpen, setDeleteConfigOpen] = useState<boolean>(false);
    const [deleteTargetName, setDeleteTargetName] = useState<string>('');
    const [updateConfigOpen, setUpdateConfigOpen] = useState<boolean>(false);
    const [updateTargetName, setUpdateTargetName] = useState<string>('');
    const [newConfigOpen, setNewConfigOpen] = useState<boolean>(false);

    const configColumns: GridColDef[] = [
        { field: 'id', hide: true },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'cron', headerName: 'Cron', flex: 1 },
        { field: 'input_type', headerName: 'Input type', flex: 1 },
        { field: 'input_uri', headerName: 'Input uri', flex: 1 },
        { field: 'output_type', headerName: 'Output type', flex: 1 },
        { field: 'output_uri', headerName: 'Output uri', flex: 1 },
        {
            field: 'update', headerName: 'Update', width: 80,
            sortable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <IconButton
                    onClick={() => {handleUpdateConfigOpen(params.getValue(params.id, 'name'))}}
                    color='primary'
                    aria-label='update-config'
                >
                    <CreateIcon />
                </IconButton>
            )
        },
        {
            field: 'delete', headerName: 'Delete', width: 80,
            sortable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <IconButton
                    onClick={() => {handleDeleteConfigOpen(params.getValue(params.id, 'name'))}}
                    color='error'
                    aria-label='delete-config'
                >
                    <DeleteIcon />
                </IconButton>
            )
        }
    ]

    const handleDeleteConfigOpen = (configName: GridCellValue) => {
        if (typeof configName === 'string') {
            setDeleteTargetName(configName);
            setDeleteConfigOpen(true);
        } else {
            alert(`${configName} is not string type`);
        }
    }

    const handleDeleteConfigClose = () => {
        setDeleteConfigOpen(false);
    }

    const handleUpdateConfigOpen = (configName: GridCellValue) => {
        if (typeof configName === 'string') {
            setUpdateTargetName(configName);
            setUpdateConfigOpen(true);
        } else {
            alert(`${configName} is not string type`);
        }
    }

    const handleUpdateConfigClose = () => {
        setUpdateConfigOpen(false);
    }

    const handleDeleteConfig = () => {
        setDeleteConfigOpen(false);
        if (deleteTargetName !== '') {
            DeleteConfig(deleteTargetName).then(value => {
                alert(value);
            })
        } else {
            alert('empty name')
        }
    }

    const handleNewConfigOpen = () => {
        setNewConfigOpen(true);
    }

    const handleNewConfigClose = () => {
        setNewConfigOpen(false);
    }

    const handleRefresh = () => {
        setLoading(true);
        ListConfig().then(value => {
            setConfigData(value);
            setLoading(false);
        })
    }

    useEffect(() => {
        setLoading(true);
        ListConfig().then(value => {
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
                            <Grid item lg={10} md={10} sm={10} xs={10} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography sx={{ml: 1}} variant='h5'>프로세스 리스트</Typography>
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2} sx={{
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
                                    onClick={handleNewConfigOpen}
                                    sx={{ height: '100%'}}
                                >
                                    신규생성
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
                fullScreen
                open={newConfigOpen}
                onClose={handleNewConfigClose}
                TransitionComponent={Transition}
            >
                <Toolbar>
                    <IconButton
                        edge='start'
                        color='error'
                        onClick={handleNewConfigClose}
                        aria-label='close'
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
                <NewConfigDialog />
            </Dialog>
            <Dialog
                fullScreen
                open={updateConfigOpen}
                onClose={handleUpdateConfigClose}
                TransitionComponent={Transition}
            >
                <Toolbar>
                    <IconButton
                        edge='start'
                        color='error'
                        onClick={handleUpdateConfigClose}
                        aria-label='close'
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
                <UpdateConfigDialog receivedName={updateTargetName}/>
            </Dialog>
            <Dialog
                open={deleteConfigOpen}
                onClose={handleDeleteConfigClose}
            >
                <DialogTitle id='delete-config-dialog'>
                    {'Delete Config'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='delete-config-dialog-description'>
                        {deleteTargetName}을(를) 정말로 제거하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfig}>예</Button>
                    <Button onClick={handleDeleteConfigClose}>아니오</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Config;