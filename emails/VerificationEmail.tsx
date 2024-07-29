import * as React from 'react'
import { Html, Head, Button, Preview, Section, Row, Text} from '@react-email/components'

interface VerificationEmailProps{
    username: string,
    otp: string
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps){
    return(
        <Html lang='en'>
            <Head>
                <title>Email Verification</title>
            </Head>
            <Preview>Your Verification code: {otp}</Preview>
            <Section>
                <Row>
                    <Text>Hello {username},</Text>
                </Row>
                <Row>
                    <Text>
                        Your verification code is {otp}.
                    </Text>
                </Row>
                <Row>
                    <Text>
                        Thank you
                    </Text>
                </Row>
            </Section>
        </Html>
    )
}