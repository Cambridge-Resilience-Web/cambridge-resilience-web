import { memo } from 'react';
import {
	Box,
	Heading,
	useBreakpointValue,
	Flex,
	Image,
	Tag,
	Stack,
	Link,
	Icon,
	Button,
} from '@chakra-ui/react';
import { SiFacebook, SiInstagram, SiTwitter } from 'react-icons/si';
import DescriptionRichText from '@components/main-list/description-rich-text';

function Listing({ listing }) {
	return (
		<Flex
					justifyContent="center"
					mt={useBreakpointValue({ base: '-1rem', md: '0' })}
				>
					<Box
						background="white"
						maxWidth={useBreakpointValue({
							base: '100%',
							md: '800px',
						})}
						mb={useBreakpointValue({ base: 0, md: 8 })}
						borderRadius={useBreakpointValue({
							base: 0,
							md: '0.375rem',
						})}
						boxShadow={useBreakpointValue({
							base: 'none',
							md: 'lg',
						})}
					>
						<Image
							alt={`${listing.title} cover image`}
							src={listing.image}
							display={listing.image ? 'block' : 'none'}
							objectFit="cover"
							width="100%"
							maxHeight="300px"
							borderTopRadius={useBreakpointValue({
								base: 0,
								md: '0.375rem',
							})}
						/>
						<Box p={useBreakpointValue({ base: 4, md: 8 })}>
							<Flex
								direction="column"
								justifyContent="center"
								alignItems="center"
							>
								<Heading as="h1" mb={4} textAlign="center">
									{listing.title}
								</Heading>
								<Tag
									mb={8}
									backgroundColor={`#${listing.category.color}`}
									userSelect="none"
									size="lg"
								>
									{listing.category.label}
								</Tag>
							</Flex>

							<DescriptionRichText html={listing.description} />

							<Flex mt={8} justifyContent="center">
								<Link
									href={listing.website}
									rel="noreferrer"
									target="_blank"
								>
									<Button
										size="lg"
										bg="rw.700"
										colorScheme="rw.700"
										_hover={{ bg: 'rw.900' }}
									>
										Visit website
									</Button>
								</Link>
							</Flex>

							<Stack
								direction="row"
								justifyContent="center"
								spacing={4}
								mt={8}
							>
								{listing.facebook && (
									<Link
										href={listing.facebook}
										target="_blank"
									>
										<Icon
											as={SiFacebook}
											color="gray.600"
											cursor="pointer"
											w={12}
											h={12}
											transition="color 150ms"
											_hover={{ color: 'gray.500' }}
										/>
									</Link>
								)}
								{listing.twitter && (
									<Link
										href={listing.twitter}
										target="_blank"
									>
										<Icon
											as={SiTwitter}
											color="gray.600"
											cursor="pointer"
											w={12}
											h={12}
											transition="color 150ms"
											_hover={{ color: 'gray.500' }}
										/>
									</Link>
								)}
								{listing.instagram && (
									<Link
										href={listing.instagram}
										target="_blank"
									>
										<Icon
											as={SiInstagram}
											color="gray.600"
											cursor="pointer"
											w={12}
											h={12}
											transition="color 150ms"
											_hover={{ color: 'gray.500' }}
										/>
									</Link>
								)}
							</Stack>
						</Box>
					</Box>
				</Flex>
	)
}

export default memo(Listing);