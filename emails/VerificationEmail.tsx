import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
} from '@react-email/components';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Your tbhfeedback Verification Code</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Use your verification code to complete your registration: {otp}</Preview>
            <Section className="bg-gray-100 p-6 rounded-lg">
                <Row className="mb-6">
                    <Heading as="h2" className="text-xl font-semibold text-gray-800">
                        Hello {username},
                    </Heading>
                </Row>
                <Row className="mb-4">
                    <Text className="text-gray-600 text-lg">
                        Thank you for signing up for TBH To complete your registration, please use the verification code below:
                    </Text>
                </Row>
                <Row className="text-center mb-6">
                    <Text className="text-2xl font-bold text-gray-800 tracking-wider">{otp}</Text>
                </Row>
                <Row className="mb-4">
                    <Text className="text-gray-600 text-base">
                        If you did not request this code, please disregard this email.
                    </Text>
                </Row>
                <Row className="mt-8">
                    <Text className="text-gray-600 text-sm">Best regards,</Text>
                    <Text className="text-gray-600 text-sm">The Better ngl Team</Text>
                </Row>
            </Section>
        </Html>
    );
}
