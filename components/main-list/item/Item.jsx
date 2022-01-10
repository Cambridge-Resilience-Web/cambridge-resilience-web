import { useCallback, useMemo, useLayoutEffect, memo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import chroma from 'chroma-js';
import {
	Box,
	Flex,
	Tag,
	Text,
	Icon,
	Tooltip,
	Image,
	chakra,
} from '@chakra-ui/react';
import { HiUserGroup } from 'react-icons/hi';
import ImagePlaceholder from './image-placeholder';

const Item = ({ dataItem, onOpenDialog }) => {
	const { ref, inView } = useInView();
	const animation = useAnimation();

	useLayoutEffect(() => {
		if (inView) {
			animation.start({
				opacity: 1,
				y: 0,
				transition: {
					type: 'spring',
					duration: 0.4,
					bounce: 0.3,
				},
			});
		}
	}, [animation, inView]);

	const openDialog = useCallback(() => {
		onOpenDialog(dataItem);
	}, [dataItem, onOpenDialog]);

	const tagBackgroundColor = useMemo(
		() => chroma(dataItem.color).alpha(0.5).css(),
		[dataItem.color],
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			exit={{ opacity: 0 }}
			animate={animation}
			whileHover={{ scale: 1.1 }}
		>
			<chakra.div
				height="fit-content"
				cursor="pointer"
				borderRadius="5px"
				backgroundColor="#ffffff"
				transition="transform 300ms ease-in-out, box-shadow 300ms ease-in-out"
				onClick={openDialog}
				boxShadow="md"
				opacity={dataItem.inactive ? 0.7 : 1}
				_hover={{ boxShadow: 'xl' }}
				ref={ref}
			>
				{dataItem.image ? (
					<Image
						alt={`${dataItem.label} cover image`}
						src={dataItem.image}
						objectFit="cover"
						width="100%"
						height="170px"
						borderTopRadius=".375rem"
					/>
				) : (
					<ImagePlaceholder
						backgroundColor={tagBackgroundColor}
						categoryLabel={dataItem.category}
					/>
				)}

				<Box px={3} pb={3}>
					<Flex justifyContent="space-between" mt={3}>
						<chakra.h2
							fontSize={15}
							fontWeight={600}
							color="#454545"
							mb={0}
							noOfLines={3}
						>
							{dataItem.title}
						</chakra.h2>
						<Tag
							backgroundColor={tagBackgroundColor}
							userSelect="none"
							height="26px"
							minWidth="fit-content"
						>
							{dataItem.category}
						</Tag>
					</Flex>
					{dataItem.seekingVolunteers && (
						<Flex>
							<Tooltip label="This group is seeking volunteers or members. Get in touch with them if you'd like to help.">
								<Text color="seagreen" fontSize="sm">
									Seeking volunteers <Icon as={HiUserGroup} />
								</Text>
							</Tooltip>
						</Flex>
					)}
				</Box>
			</chakra.div>
		</motion.div>
	);
};

export default memo(Item);
