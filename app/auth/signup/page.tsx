'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import NextLink from 'next/link'
import { Button, Input, Flex, Box, Text, Center, Link } from '@chakra-ui/react'
import Image from 'next/legacy/image'
import LogoImage from '../../../public/logo.png'
import styles from '../auth.module.scss'

export default function SignIn() {
  const [error, setError] = useState('')
  const router = useRouter()

  return (
    <div className={styles.root}>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Box bgColor="#ffffff" p={12} borderRadius={12} mb="2rem" width="500px">
          <Box mb="1rem" display="flex" justifyContent="center">
            <Image
              alt="Resilience Web logo"
              src={LogoImage}
              width="306"
              height="104"
            />
          </Box>
          <Center mb="2rem">
            <Text fontSize="md">Welcome! Enter your email to get started:</Text>
          </Center>
          <form
            onSubmit={async (e) => {
              try {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const response = await signIn('email', {
                  email: formData.get('email'),
                  redirect: false,
                  callbackUrl: window.location.origin,
                })

                if (response?.error) throw new Error(response.error)
                router.push(response?.url ?? '/')
              } catch (error) {
                setError(
                  e instanceof Error ? e.message : 'An unknown error occurred.',
                )
              }
            }}
          >
            <label htmlFor="email">
              Email
              <Input type="email" id="email" name="email" />
            </label>
            <Button type="submit" mt={2} width="100%" variant="rw">
              Sign up
            </Button>
            {error}
          </form>
        </Box>
        <Box bgColor="#ffffff" p={6} borderRadius={12} width="500px">
          Not a member of Resilience Web?{' '}
          <Link
            as={NextLink}
            href="/auth/signin"
            color="rw.900"
            _hover={{ color: 'rw.700' }}
          >
            Sign up
          </Link>
        </Box>
      </Flex>
    </div>
  )
}
