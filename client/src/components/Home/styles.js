import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    appBarSearch: {
        borderRadius: 4,
        marginBottom: '1rem',
        display: 'flex',
        padding: '16px',
    },
    pagination: {
        borderRadius: 4,
        marginBottom: '1rem',
        padding: '16px',
    },
    gridContainer: {
        [ theme.breakpoints.down('xs')]: {
            flexDirection: 'column-reverse',
        },
    },
    searchButton: {
        textColor: '#ffffff'
    },
}));

export default useStyles;