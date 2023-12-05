
export const styles = {
    loginSignUpBtn: (mode: string, item: {
        name: string;
    }) => ({
        textAlign: 'center',
        border: [mode].includes(item?.name) ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
        flex: 1,
        borderRadius: 5,
        padding: 1,
        cursor: 'pointer',
    } as {
        textAlign: string;
        border: string;
        flex: number;
        borderRadius: number;
        padding: number;
        cursor: string
    }),
    glassphorism: (blur = '5px', radius = '12px') => ({
        backdropFilter: `blur(${blur}) saturate(187%)`,
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: radius,
        border: '1px solid rgba(255, 255, 255, 0.125)',
    }),
    iconStyle: () => ({
        opacity: 0.8,
        ":hover": {
            color: 'red'
        }
    }),
    heading1: (font = 30) => ({
        fontSize: font,
        position: 'relative',
        "::after": {
            content: '""',
            position: 'absolute',
            width: 60,
            height: '2px',
            bottom: -5,
            left: 0,
            background: "green"
        },
        "::before": {
            content: '""',
            position: 'absolute',
            width: 40,
            height: '2px',
            bottom: -9,
            left: 0,
            background: "green"
        }
    }),
    memberCard: () => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...styles.glassphorism(),
        flex: '1 0 15%',
        // maxWidth: '90%',
        // width: '15%',
        // minWidth: '15%',
        height: 'auto',
        // marginTop: 5,
        padding: 6,
        pr: 4,
        pl: 4,
        gap: 1.5,
        position: 'relative'
    }),
    avtarContainer: () => ({
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px 0',
        flex: 1
    }),
    blogCard: () => ({
        flex: 1,
        ...styles.glassphorism(),
        padding: 4,
        pl: 4,
        pr: 4,
        '::before': {
            content: '""',
            position: "absolute",
            top: '50%',
            left: -30,
            transform: "translateY(-50%) rotate(45deg)",
            width: 12,
            height: 12,
            ...styles.glassphorism('', '0px')
        },
        '::after': {
            content: '""',
            position: 'absolute',
            top: 'calc(50% - 1px)',
            left: -(30 - 13),
            width: (30 - 13),
            height: '1px',
            ...styles.glassphorism()
        }
    }),
    containerStyle: () => ({
        mt: 3,
        gap: 5,
        display: 'flex',
        flexDirection: 'column'
        , marginBottom: 7
    })
}