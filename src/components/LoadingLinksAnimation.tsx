import { Player } from "@remotion/player";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";

const DURATION_IN_FRAMES = 60;
const FPS = 30;
const SIZE = 320;
const IMAGE_SIZE = 200;
const RING_SIZE = 300;
const DOTS = [
	"d0",
	"d1",
	"d2",
	"d3",
	"d4",
	"d5",
	"d6",
	"d7",
	"d8",
	"d9",
	"d10",
	"d11",
];
const DOT_COUNT = DOTS.length;
const IMAGE_SRC = "/images/loading-links.png";

function LoadingLinksComposition() {
	const frame = useCurrentFrame();
	const cycle = frame % DURATION_IN_FRAMES;
	const lift = interpolate(cycle, [0, 15, 30, 45, 60], [0, -10, 0, 6, 0]);
	const imageRotate = interpolate(cycle, [0, 30, 60], [-4, 4, -4]);
	const scale = interpolate(cycle, [0, 12, 30, 48, 60], [1, 1.04, 1, 0.98, 1]);
	const ringRotate = (frame / DURATION_IN_FRAMES) * 360;

	return (
		<AbsoluteFill
			style={{
				alignItems: "center",
				background: "transparent",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					alignItems: "center",
					display: "flex",
					height: SIZE,
					justifyContent: "center",
					position: "relative",
					width: SIZE,
				}}
			>
				<div
					style={{
						height: RING_SIZE,
						left: "50%",
						marginLeft: -RING_SIZE / 2,
						marginTop: -RING_SIZE / 2,
						position: "absolute",
						top: "50%",
						transform: `rotate(${ringRotate}deg)`,
						transformOrigin: "center center",
						width: RING_SIZE,
					}}
				>
					{DOTS.map((id, i) => {
						const angle = (i / DOT_COUNT) * 360;
						// Head at i=0, fading tail behind
						const trailPos = i / (DOT_COUNT - 1);
						const opacity = 1 - trailPos * 0.85;
						const dotScale = 1.2 - trailPos * 0.7;
						return (
							<div
								key={id}
								style={{
									height: RING_SIZE,
									left: 0,
									position: "absolute",
									top: 0,
									transform: `rotate(${angle}deg)`,
									width: RING_SIZE,
								}}
							>
								<div
									style={{
										background: "#000",
										border: "2px solid #000",
										borderRadius: "50%",
										boxShadow: "2px 2px 0 #000",
										height: 18,
										left: "50%",
										marginLeft: -9,
										opacity,
										position: "absolute",
										top: -9,
										transform: `scale(${dotScale})`,
										width: 18,
									}}
								/>
							</div>
						);
					})}
				</div>
				<Img
					src={IMAGE_SRC}
					style={{
						height: IMAGE_SIZE,
						objectFit: "contain",
						transform: `translateY(${lift}px) rotate(${imageRotate}deg) scale(${scale})`,
						width: IMAGE_SIZE,
					}}
				/>
			</div>
		</AbsoluteFill>
	);
}

export function LoadingLinksAnimation() {
	return (
		<output
			aria-label="Loading links"
			aria-live="polite"
			className="block h-48 w-48 sm:h-56 sm:w-56"
		>
			<Player
				autoPlay
				clickToPlay={false}
				component={LoadingLinksComposition}
				compositionHeight={SIZE}
				compositionWidth={SIZE}
				controls={false}
				durationInFrames={DURATION_IN_FRAMES}
				fps={FPS}
				loop
				style={{
					height: "100%",
					width: "100%",
				}}
			/>
		</output>
	);
}
