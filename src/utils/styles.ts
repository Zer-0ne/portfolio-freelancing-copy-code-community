import { colors } from "./colors";

export const styles = {
    navbar: () => ({
        position: 'sticky',
        left: 0,
        right: 0,
        height: 50,
        zIndex: 5,
        top: '10px',
        padding: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        ...styles.glassphorism(),
        margin: '15px 20px'
    }),
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
    glassphorism: (blur = '5px', radius: number | string = '12px', backgroundColor = 'rgba(0, 0, 0, 0.2)') => ({
        backdropFilter: `blur(${blur}) saturate(187%)`,
        background: backgroundColor,
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
    }),
    dateTimeBox: () => ({
        padding: '5px 8px 5px 15px',
        borderRadius: 20,
        color: 'black',
        background: colors.dateTimeBoxBackgroundColor,
        display: 'flex',
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 10,
        fontWeight: '600',
        margin: '0 5px',
        position: 'relative',
        '::before': {
            content: '""',
            background: 'black',
            position: 'absolute',
            left: 8,
            height: '5px',
            width: '5px',
            borderRadius: '50%',
            top: '50%',
            mt: '-2.5px'
        }
    }),
    eventCard: (label: string | undefined) => ({
        padding: 4,
        ...styles.glassphorism('', '0 12px 12px 0'),
        cursor: 'pointer',
        position: 'relative',
        '::before': {
            content: '""',
            position: 'absolute',
            height: '100%',
            width: 4,
            background: 'red',
            left: -2,
            top: 0,
            borderRadius: '12px 0 0 12px',
        },
        "::after": {
            content: `"${label}"`,
            display: label ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
            position: 'absolute',
            right: -((15) * 3),
            top: 0,
            height: '100%',
            width: 15,
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            textTransform: 'uppercase',
            fontWeight: '700',
            letterSpacing: 2,
            ...styles.glassphorism('', 3, colors.darkRedTransparent)
        },
        display: 'flex',
        gap: 3
    }),
    eventCardRight: () => ({
        display: 'flex',
        flex: 1,
        padding: 3,
        position: 'relative',
        borderLeft: `1px solid ${colors.transparentGrey}`,
        justifyContent: 'center',
        alignItems: 'baseline',
        flexDirection: 'column',
        gap: 2
    })
}