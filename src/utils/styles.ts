
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
    glassphorism: (blur = '5px') => ({
        backdropFilter: `blur(${blur}) saturate(187%)`,
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
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
            width: '45%',
            height: '2px',
            bottom: -8,
            left: 0,
            background: "green"
        },
        "::before": {
            content: '""',
            position: 'absolute',
            width: '25%',
            height: '2px',
            bottom: -12,
            left: 0,
            background: "green"
        }
    }),
    memberCard: () => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...styles.glassphorism(),
        flex: '1 0 20%',
        // width: '30%',
        height: 'auto',
        // marginTop: 5,
        padding: 8,
        pr: 4,
        pl: 4,
        gap: 1
    }),
    avtarContainer: () => ({
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px 0',
        flex: 1
    })
}