// src/components/AuthModal.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { signIn } from 'next-auth/react';
import { Google, GitHub, LinkedIn } from '@mui/icons-material';
import { Box } from '@mui/material';
import { RootState } from '@/store/store';
import { styles } from '@/utils/styles';
import CustomModal from '@/components/CustomModal';

const AuthModal = () => {
    const { session } = useSelector((state: RootState) => state.session);
    const [AuthModal, setAuthModalState] = useState<boolean>(!!session?.length);

    useEffect(() => {
        setAuthModalState(!!session?.length);
    }, [session]);

    const handleLogin = async (provider: string) => {
        await signIn(provider);
    };

    return (
        <>
            {!AuthModal && (
                <CustomModal open={!AuthModal} setOpen={setAuthModalState as React.Dispatch<React.SetStateAction<boolean>>}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 5,
                            mt: 4,
                            mb: 1,
                            flex: 1,
                            width: '100%',
                            justifyContent: 'center',
                            position: 'relative',
                            ":before": {
                                content: '"Please Login first"',
                                position: 'absolute',
                                top: -30,
                                display: 'flex',
                                justifyContent: 'center',
                                left: 0,
                                right: 0,
                                opacity: 0.5,
                            },
                        }}
                    >
                        <Google sx={styles.socialMediaIcon()} onClick={() => handleLogin('google')} />
                        <GitHub sx={styles.socialMediaIcon()} onClick={() => handleLogin('github')} />
                        <LinkedIn sx={styles.socialMediaIcon()} onClick={() => handleLogin('linkedin')} />
                    </Box>
                </CustomModal>
            )}
        </>
    );
};

export default AuthModal;
