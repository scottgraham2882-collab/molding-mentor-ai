export type DefectGuide = {
  name: string;
  slug: string;
  description: string;
  causes: string[];
  checkFirst: string[];
  actions: string[];
  processAreas: string[];
  materialChecks: string[];
  whyThisHappens?: {
    simple: string;
    scientific: string;
    misconceptions: string[];
    unhelpfulFirstMoves: string[];
    experiencedTechChecks: string[];
  };
  teachNewTechnician?: string[];
};

export const defectGuides: DefectGuide[] = [
  {
    name: "Short Shot",
    slug: "short-shot",
    description: "A part is only partially filled because the melt front freezes or loses pressure before the cavity is completely filled and packed.",
    causes: ["Insufficient shot size, injection pressure, injection speed, or pressure limit.", "Melt or mold temperature is too low for the resin and flow length.", "Blocked gates, runners, nozzles, vents, or restricted material flow paths."],
    checkFirst: ["Confirm cushion, transfer position, fill time, peak pressure, and whether the press is pressure-limited.", "Inspect feed, nozzle, gate, runner, and end-of-fill vents for restrictions."],
    actions: ["Increase shot size, transfer later, injection speed, or pressure limit in controlled steps.", "Raise melt or mold temperature within the approved material range.", "Clean or repair blocked flow paths, worn check rings, and restricted vents."],
    processAreas: ["Fill speed", "Shot size", "Transfer", "Venting", "Melt temperature"],
    materialChecks: ["Lot viscosity", "Drying status", "Regrind level", "Feed consistency"],

    whyThisHappens: {
      simple: "The plastic is not making it to the end of the cavity before it cools or runs out of push.",
      scientific: "The melt front loses usable pressure or temperature before volumetric fill is complete, often from pressure limits, viscosity increase, restriction, or early transfer.",
      misconceptions: ["It is not always fixed by adding more shot size.", "A short shot can still happen even when the hopper is full."],
      unhelpfulFirstMoves: ["Only raising barrel heat without checking pressure limit or restrictions.", "Adding pack pressure when the cavity is not filled enough to pack."],
      experiencedTechChecks: ["Cushion, fill time, peak pressure, transfer position, and pressure-limit alarms.", "Gate, runner, nozzle, feed, and end-of-fill vent restrictions."],
    },
    teachNewTechnician: ["Save a short sample and mark where flow stopped.", "Ask: did it start after material, mold, or setup changes?", "If the machine is pressure-limited, more speed may not actually fill the part.", "Do not pack a part that is still short; fix fill first."],
  },
  {
    name: "Flash",
    slug: "flash",
    description: "Thin excess plastic escapes at the parting line, vents, ejector pins, inserts, or shutoffs where the mold should remain sealed.",
    causes: ["Clamp force is too low or cavity pressure is too high.", "Worn, damaged, dirty, or misaligned mold shutoffs and parting-line surfaces.", "Excessive melt temperature, injection speed, pack pressure, or pack time."],
    checkFirst: ["Inspect parting line, vents, inserts, ejector areas, and mold alignment before changing pack.", "Verify clamp tonnage and compare peak pressure to the validated process."],
    actions: ["Clean or repair shutoffs, vent lands, inserts, and damaged parting-line areas.", "Reduce transfer, pack pressure, pack time, or injection speed in measured steps.", "Confirm fill-only parts separate fill pressure from pack pressure."],
    processAreas: ["Clamp", "Pack/hold", "Transfer", "Tooling shutoffs", "Venting"],
    materialChecks: ["Melt temperature", "Viscosity shift", "Moisture", "Wrong resin grade"],

    whyThisHappens: {
      simple: "Plastic is squeezing through places where the mold should stay closed.",
      scientific: "Cavity pressure exceeds the sealing capability of the clamp, parting line, vents, inserts, or shutoffs.",
      misconceptions: ["Flash is not always a clamp-tonnage problem.", "More cooling rarely fixes plastic leaking through a damaged shutoff."],
      unhelpfulFirstMoves: ["Turning up clamp before inspecting dirty or damaged shutoffs.", "Lowering pack so far that dimensions or sinks go bad."],
      experiencedTechChecks: ["Exact flash location, mold face cleanliness, vent depth, shutoffs, clamp setup, and peak pressure.", "Whether flash appears during fill, pack, or after a recent tool issue."],
    },
    teachNewTechnician: ["Circle the exact flash location on a sample.", "Flash at vents can mean vents are too deep or dirty, not just high pressure.", "Do not hide a tooling problem by making weak parts.", "Compare new flash to last known good samples."],
  },
  {
    name: "Sink Marks",
    slug: "sink-marks",
    description: "Localized depressions appear when thick sections shrink after the outer skin has already solidified.",
    causes: ["Insufficient packing pressure, packing time, or gate seal control.", "Thick ribs, bosses, or wall sections cool slower than surrounding areas.", "Mold temperature, melt temperature, or cooling time is not balanced for the geometry."],
    checkFirst: ["Review part weight trend, cushion, pack pressure/time, and gate seal evidence.", "Check water flow around thick sections, cores, ribs, and bosses."],
    actions: ["Increase pack pressure and pack time until gate seal is confirmed.", "Improve cooling around thick sections and verify water flow.", "Review wall uniformity, rib thickness, and coring opportunities."],
    processAreas: ["Pack/hold", "Gate seal", "Cooling", "Part design", "Mold temperature"],
    materialChecks: ["Shrink rate", "Filler content", "Drying", "Lot change"],

    whyThisHappens: {
      simple: "A thick area keeps shrinking after the outside skin has frozen, pulling the surface inward.",
      scientific: "Volumetric shrinkage in thick sections is not fully compensated by packing before gate seal or by balanced cooling.",
      misconceptions: ["More cooling time alone may only make slower scrap.", "A sink is not always a material defect."],
      unhelpfulFirstMoves: ["Adding cooling time before checking pack, hold time, and gate seal.", "Raising pack blindly without checking flash, weight, or cushion stability."],
      experiencedTechChecks: ["Part weight trend, gate seal, cushion, pack pressure/time, and cooling near ribs or bosses.", "Whether the sink is tied to thick geometry."],
    },
    teachNewTechnician: ["Look behind the sink for a rib, boss, or thick wall.", "Use part weight to see if packing is changing the part.", "Pack only works while the gate is open.", "Thick steel areas need good water flow."],
  },
  {
    name: "Burn Marks",
    slug: "burn-marks",
    description: "Dark or charred areas form where trapped gas overheats, material degrades, or melt sees excessive shear.",
    causes: ["Poor venting traps air or gas near end-of-fill locations.", "Injection speed, screw speed, or back pressure creates excessive shear heat.", "Residence time, barrel temperature, or contamination causes degradation."],
    checkFirst: ["Locate burn marks versus end-of-fill, weld lines, vents, gates, and cavity number.", "Inspect vents and purge condition for degraded material."],
    actions: ["Clean, inspect, or add venting at trapped gas locations.", "Reduce fill speed, screw speed, back pressure, or melt temperature when shear is excessive.", "Purge degraded material and reduce residence time."],
    processAreas: ["Venting", "Fill speed", "Shear", "Residence time", "Hot runner"],
    materialChecks: ["Degradation", "Contamination", "Drying temperature", "Purge compatibility"],

    whyThisHappens: {
      simple: "Air, gas, or degraded plastic gets trapped and overheats, leaving a dark mark.",
      scientific: "Compressed gas at end-of-fill or excessive shear/residence heat oxidizes or degrades polymer near vents, gates, or dead spots.",
      misconceptions: ["Burns are not always caused by barrel temperature.", "Slowing fill too much can create other problems and may not clean a blocked vent."],
      unhelpfulFirstMoves: ["Dropping all barrel heats before checking venting.", "Purging once and restarting without finding the burn location pattern."],
      experiencedTechChecks: ["Burn location versus vents, end-of-fill, weld lines, hot runner drops, and cavity number.", "Vent cleanliness, fill speed profile, residence time, and purge evidence."],
    },
    teachNewTechnician: ["Burns often point to trapped gas; find where air wants to leave.", "Save cavity-numbered samples.", "A black speck everywhere is different from a burn at one end-of-fill spot.", "Clean vents before chasing random temperatures."],
  },
  {
    name: "Splay",
    slug: "splay",
    description: "Silver or streaky surface marks appear as moisture, volatiles, trapped air, or shear-degraded material reaches the surface.",
    causes: ["Material moisture is too high or drying conditions are incorrect.", "Air is entrained from poor feed, excessive decompression, or turbulent flow.", "Melt temperature, screw recovery, or fill speed causes degradation or shear."],
    checkFirst: ["Verify dryer temperature, dew point, drying time, and moisture readings.", "Check decompression, screw speed, back pressure, and feed throat stability."],
    actions: ["Dry or replace suspect resin and protect it from moisture pickup.", "Reduce suck-back, screw speed, back pressure, or aggressive fill speed.", "Purge contamination and clean material handling paths."],
    processAreas: ["Drying", "Screw recovery", "Decompression", "Fill speed", "Venting"],
    materialChecks: ["Moisture", "Volatiles", "Colorant compatibility", "Regrind cleanliness"],

    whyThisHappens: {
      simple: "Moisture, air, or degraded material streaks across the part surface.",
      scientific: "Vapor, volatiles, entrained air, or shear-degraded polymer reaches the flow front and creates silver surface streaks.",
      misconceptions: ["Splay is not always fixed by more heat.", "Dryer temperature alone does not prove the resin is dry."],
      unhelpfulFirstMoves: ["Raising barrel heat first.", "Changing colorant or speed before checking drying time, dew point, and hopper cover."],
      experiencedTechChecks: ["Dryer temperature, dew point, drying time, airflow, material age, and moisture reading.", "Suck-back, screw speed, back pressure, and feed stability."],
    },
    teachNewTechnician: ["Silver streaks that follow flow often mean material or air is involved.", "Check the dryer, not just the press.", "Keep dried material covered and moving.", "Too much suck-back can pull air into the melt."],
  },
  {
    name: "Warpage",
    slug: "warpage",
    description: "A molded part bends, twists, or bows when uneven shrinkage and residual stress pull the geometry out of shape.",
    causes: ["Uneven wall thickness, gate location, fiber orientation, or flow-induced stress.", "Unbalanced mold cooling or inconsistent coolant flow.", "Pack, hold, cooling, or ejection settings create nonuniform shrinkage."],
    checkFirst: ["Compare cooling water temperature and flow across cavities and mold halves.", "Measure dimensions at the same time after molding and review pack/cooling history."],
    actions: ["Balance mold temperatures and water circuits.", "Optimize pack pressure, hold time, cooling time, and ejection timing.", "Review gate location, wall thickness, ribs, and fiber direction."],
    processAreas: ["Cooling", "Pack/hold", "Ejection", "Mold temperature", "Part design"],
    materialChecks: ["Shrink rate", "Fiber orientation", "Filler content", "Lot change"],

    whyThisHappens: {
      simple: "The part cools and shrinks unevenly, so it bends as stress relaxes.",
      scientific: "Nonuniform shrinkage from cooling imbalance, orientation, packing gradients, wall thickness, or ejection stress distorts the molded geometry.",
      misconceptions: ["Warpage is not always fixed by adding cooling time.", "One mold-temperature change can move the warp instead of solving it."],
      unhelpfulFirstMoves: ["Changing one water temperature without checking flow.", "Bending hot parts by stacking or handling them before they stabilize."],
      experiencedTechChecks: ["Water flow and temperature by circuit, part temperature at ejection, pack balance, cavity differences, and handling.", "Gate location, wall thickness, fiber direction, and cooling layout."],
    },
    teachNewTechnician: ["Let parts cool the same way before judging warp.", "Compare cavities separately.", "Check water flow before changing mold temperature.", "Handling a hot part can create a false warp problem."],
  },
  {
    name: "Jetting",
    slug: "jetting",
    description: "A snake-like stream or folded surface pattern appears when melt shoots through the gate without bonding smoothly to the cavity wall.",
    causes: ["Gate directs melt into open space instead of against a wall.", "Initial injection speed is too high for the gate and part geometry.", "Melt or mold temperature is too low for proper flow-front bonding."],
    checkFirst: ["Review gate style/location and whether the mark starts at the gate.", "Compare first-stage speed profile to the validated setup."],
    actions: ["Slow the initial injection speed or use a staged fill profile.", "Raise mold or melt temperature within the approved range.", "Review gate redesign, tab gate, or impingement options with tooling."],
    processAreas: ["Gate design", "Fill speed", "Melt temperature", "Mold temperature", "Flow front"],
    materialChecks: ["Viscosity", "Drying", "Cold material", "Colorant shear sensitivity"],
  },
  {
    name: "Weld Lines",
    slug: "weld-lines",
    description: "Visible or weak knit lines form where two melt fronts meet around holes, inserts, ribs, or multiple gates.",
    causes: ["Melt fronts are too cool or slow when they meet.", "Venting is poor at the meeting location.", "Gate location, wall thickness, or flow length creates a weak knit."],
    checkFirst: ["Map the line location against gates, holes, ribs, inserts, and end-of-fill vents.", "Check part strength requirements at the weld line."],
    actions: ["Increase melt temperature, mold temperature, or fill speed in controlled steps.", "Improve venting where melt fronts meet.", "Review gate location, flow leaders, overflow wells, or design changes."],
    processAreas: ["Fill speed", "Melt temperature", "Mold temperature", "Venting", "Gate design"],
    materialChecks: ["Moisture", "Contamination", "Filler orientation", "Regrind level"],

    whyThisHappens: {
      simple: "Two flow fronts meet but do not knit together cleanly.",
      scientific: "Melt fronts lose heat, pressure, or venting as they recombine around holes, inserts, ribs, or multiple gates.",
      misconceptions: ["A visible line is not always weak, but it must be checked if strength matters.", "More pack may not heal a cold or poorly vented weld line."],
      unhelpfulFirstMoves: ["Adding pack pressure before mapping where flows meet.", "Polishing the mark without checking strength, heat, speed, and venting."],
      experiencedTechChecks: ["Line location versus gates, holes, inserts, ribs, and vents.", "Melt/mold temperature, fill speed, and strength requirement at the line."],
    },
    teachNewTechnician: ["Trace the flow path from the gate to the line.", "Ask whether the line is cosmetic or functional.", "Venting at the meeting point matters.", "Cold flow fronts make weak knit lines."],
  },
  {
    name: "Flow Lines",
    slug: "flow-lines",
    description: "Rings, waves, or streaks show the path of a cooling or hesitating melt front on the part surface.",
    causes: ["Melt front is too cold or inconsistent during fill.", "Fill speed changes abruptly or hesitates.", "Wall thickness transitions, gates, or cold mold surfaces create visible flow history."],
    checkFirst: ["Check if lines follow flow from the gate and whether fill time is repeatable.", "Confirm mold temperature and water circuit stability."],
    actions: ["Increase mold or melt temperature within limits.", "Smooth the injection speed profile and avoid hesitation.", "Review gate size/location and wall transitions."],
    processAreas: ["Fill profile", "Mold temperature", "Melt temperature", "Gate design", "Wall thickness"],
    materialChecks: ["Viscosity shift", "Colorant dispersion", "Moisture", "Lot change"],
  },
  {
    name: "Voids",
    slug: "voids",
    description: "Internal pockets or bubbles form inside thick sections when shrinkage or trapped gas is not compensated by packing.",
    causes: ["Insufficient pack pressure or hold time before gate seal.", "Thick sections shrink internally as the outside freezes.", "Moisture or volatiles create gas pockets."],
    checkFirst: ["Section or weigh parts and review gate seal, cushion, pack pressure, and hold time.", "Verify drying and moisture condition before increasing pack."],
    actions: ["Increase effective packing until gate seal is proven.", "Improve cooling and core thick sections where possible.", "Dry or replace resin if gas voids are moisture-related."],
    processAreas: ["Pack/hold", "Gate seal", "Cooling", "Part design", "Drying"],
    materialChecks: ["Moisture", "Volatiles", "Shrink rate", "Regrind"],

    whyThisHappens: {
      simple: "A bubble or pocket forms inside the part because the center was not packed or gas was trapped.",
      scientific: "Internal shrinkage voids form when packing cannot feed thick sections before gate seal; gas voids come from moisture, volatiles, or trapped air.",
      misconceptions: ["All bubbles are not the same; shrink voids and gas bubbles need different fixes.", "More cooling alone does not add missing plastic to the center."],
      unhelpfulFirstMoves: ["Increasing cooling time before sectioning or weighing parts.", "Adding pack without checking gate seal, cushion, or drying."],
      experiencedTechChecks: ["Cut parts, part weight, gate seal, cushion, pack/hold, and whether bubbles are in thick sections.", "Drying/moisture data when bubbles look gas-related."],
    },
    teachNewTechnician: ["Cut a sample if allowed; do not guess from the surface only.", "Void in a thick boss often points to packing or design.", "Gas bubbles point you back to drying or trapped air.", "Pack must reach the area before the gate freezes."],
  },
  {
    name: "Brittleness",
    slug: "brittleness",
    description: "Parts crack, snap, or lose impact strength due to degradation, stress, contamination, weak weld lines, or poor packing.",
    causes: ["Wet or overheated resin has degraded.", "Too much regrind, wrong grade, or incompatible contamination is present.", "Weak weld lines, voids, molded-in stress, or underpacking reduce strength."],
    checkFirst: ["Confirm resin grade, drying records, moisture readings, lot, and regrind percentage.", "Compare break location to gates, weld lines, bosses, and high-stress features."],
    actions: ["Run properly dried virgin resin as a baseline.", "Reduce residence time, melt temperature, and regrind exposure.", "Restore pack/cooling settings and escalate for material testing if needed."],
    processAreas: ["Drying", "Residence time", "Pack/hold", "Cooling", "Weld lines"],
    materialChecks: ["Moisture degradation", "Regrind", "Wrong grade", "Contamination"],
  },
  {
    name: "Sticking",
    slug: "sticking",
    description: "Parts hang on the core, cavity, slides, or lifters instead of releasing cleanly during ejection.",
    causes: ["Insufficient draft, rough polish, undercuts, or damaged tooling.", "Part is too hot, overpacked, or shrinking tightly onto the core.", "Ejection system is unbalanced or moving too fast."],
    checkFirst: ["Identify exactly where the part hangs and inspect draft, polish, vents, slides, and ejectors.", "Check part temperature, cooling time, pack pressure, and ejection stroke/speed."],
    actions: ["Increase cooling or reduce overpacking where allowed.", "Balance ejection speed, stroke, and ejector return.", "Repair polish, add draft, or correct undercuts with tooling."],
    processAreas: ["Ejection", "Cooling", "Pack/hold", "Tool polish", "Draft"],
    materialChecks: ["Mold release use", "Shrink rate", "Additive bloom", "Resin grade"],
  },
  {
    name: "Drag Marks",
    slug: "drag-marks",
    description: "Scratches or scuffed streaks appear in the direction of draw when the part rubs during release.",
    causes: ["Insufficient draft, rough steel, burrs, or damaged texture.", "Part sticks from heat, overpacking, or shrink onto the core.", "Ejectors, slides, or lifters are misaligned."],
    checkFirst: ["Match mark direction to mold opening, slides, lifters, or ejection movement.", "Inspect steel condition and part release temperature."],
    actions: ["Polish or repair damaged steel and confirm adequate draft.", "Reduce sticking by adjusting pack/cooling within limits.", "Inspect and align slides, lifters, and ejector timing."],
    processAreas: ["Ejection", "Draft", "Tool surface", "Cooling", "Pack/hold"],
    materialChecks: ["Shrink rate", "Lubricants", "Mold release", "Filler abrasion"],
  },
  { name: "Ejector Pin Marks", slug: "ejector-pin-marks", description: "Raised, shiny, white, or depressed circles appear where ejector pins push the part out of the mold.", causes: ["Ejection force is high because the part is sticking or too hot.", "Ejector pins are uneven, damaged, undersized, or poorly located.", "Pack pressure or cooling imbalance creates stress at pin locations."], checkFirst: ["Inspect ejector pin height, condition, location, and witness marks.", "Check cooling time, part temperature, sticking, and pack pressure."], actions: ["Correct sticking and balance ejection speed/stroke.", "Increase cooling or reduce pack if the process is overpacked.", "Repair, polish, resize, or relocate ejector pins with tooling."], processAreas: ["Ejection", "Cooling", "Pack/hold", "Tooling", "Part design"], materialChecks: ["Shrink rate", "Mold release", "Filler content", "Stress whitening tendency"] },
  { name: "Gate Blush", slug: "gate-blush", description: "A hazy, white, or dull halo appears around the gate from shear, stress, cold slugging, or gate freeze effects.", causes: ["Excessive shear through a small or restrictive gate.", "High injection speed, cold material, or cold mold near the gate.", "Gate design or vestige creates localized stress."], checkFirst: ["Confirm blush starts at the gate and compare gate size, temperature, and first-stage speed.", "Check material drying and colorant compatibility."], actions: ["Reduce initial injection speed or gate shear.", "Raise melt/mold temperature within approved limits.", "Review gate size, land, cold slug, or vestige improvements."], processAreas: ["Gate design", "Fill speed", "Shear", "Melt temperature", "Mold temperature"], materialChecks: ["Moisture", "Colorant", "Stress whitening", "Cold pellets"] },
  { name: "Stringing", slug: "stringing", description: "Thin strands of plastic remain at the nozzle, sprue, hot-runner tip, or gate after mold open or part removal.", causes: ["Nozzle or hot-runner tip is too hot.", "Decompression, suck-back, or valve-gate timing is incorrect.", "Material has low viscosity, moisture, or excessive melt temperature."], checkFirst: ["Observe whether strings come from nozzle, sprue, gate, or hot-runner drops.", "Check nozzle/tip temperatures, decompression, and valve-gate timing."], actions: ["Lower nozzle or hot-tip temperature in small steps.", "Adjust decompression, sprue break, or valve-gate close timing.", "Verify drying and reduce melt temperature if material is too fluid."], processAreas: ["Nozzle", "Hot runner", "Decompression", "Melt temperature", "Gate timing"], materialChecks: ["Moisture", "Melt flow", "Additives", "Drying"] },
  { name: "Overpacking", slug: "overpacking", description: "The part is forced with too much hold pressure or time, causing high weight, flash, stress, sticking, or dimensional oversize.", causes: ["Pack pressure, pack time, or transfer position is too aggressive.", "Gate remains open longer than expected.", "Process compensates for another issue with excessive pressure."], checkFirst: ["Compare part weight, dimensions, cushion, transfer, pack pressure, and gate seal study.", "Look for flash, stress whitening, sticking, and high ejection force."], actions: ["Reduce pack pressure/time or transfer earlier in controlled steps.", "Use gate seal data to avoid packing after the gate is frozen.", "Fix tooling or fill restrictions instead of masking them with pack."], processAreas: ["Pack/hold", "Transfer", "Gate seal", "Clamp", "Ejection"], materialChecks: ["Shrink rate", "Viscosity", "Lot change", "Stress sensitivity"] },
  { name: "Underpacking", slug: "underpacking", description: "The part receives too little hold pressure or time, causing low weight, sink, voids, weak features, or dimensional undersize.", causes: ["Pack pressure/time is too low or transfer is too early.", "Gate freezes before pressure reaches thick sections.", "Cushion, check ring, or material feed is inconsistent."], checkFirst: ["Trend part weight, cushion, transfer, pack pressure/time, and gate seal evidence.", "Inspect for sinks, voids, weak bosses, and undersize dimensions."], actions: ["Increase pack pressure/time until part weight stabilizes at gate seal.", "Correct cushion or check-ring variation.", "Improve gate size, cooling, or thick-section design if pressure cannot reach the area."], processAreas: ["Pack/hold", "Gate seal", "Transfer", "Cushion", "Part weight"], materialChecks: ["Viscosity", "Drying", "Regrind", "Shrink rate"] },
  { name: "Dimensional Variation", slug: "dimensional-variation", description: "Critical dimensions drift or vary between shots, cavities, shifts, or measurement times.", causes: ["Cushion, transfer, pack, cooling, or mold temperature is unstable.", "Material lot, moisture, regrind, or shrink behavior changed.", "Measurement timing, fixture, or method is inconsistent."], checkFirst: ["Confirm the same gage, fixture, and time-after-molding are used.", "Trend cushion, fill time, peak pressure, part weight, water temperature, and cavity data."], actions: ["Stabilize process inputs before adjusting nominal dimensions.", "Balance cooling and packing across cavities.", "Verify material lot/drying and update process window if validated."], processAreas: ["Pack/hold", "Cooling", "Mold temperature", "Measurement", "Cavity balance"], materialChecks: ["Lot shrink", "Moisture", "Regrind", "Filler content"] },
  { name: "Color Streaks", slug: "color-streaks", description: "Visible streaks or swirls of different color show uneven colorant dispersion, contamination, moisture, or purge carryover.", causes: ["Color concentrate is poorly mixed or incompatible.", "Previous color/material remains in barrel, hot runner, loader, or grinder.", "Moisture, temperature, or shear causes additive separation."], checkFirst: ["Check colorant ratio, mixer/feed consistency, and recent color change history.", "Inspect purge, hopper, loader, grinder, and hot-runner drops."], actions: ["Purge and clean the complete material path.", "Verify letdown ratio and mixer operation.", "Adjust screw speed/back pressure only after material handling is correct."], processAreas: ["Material feed", "Mixing", "Screw recovery", "Hot runner", "Purging"], materialChecks: ["Colorant compatibility", "Contamination", "Moisture", "Regrind segregation"] },
  { name: "Gloss Variation", slug: "gloss-variation", description: "Part surfaces show inconsistent shine, dull patches, or cavity-to-cavity gloss differences.", causes: ["Mold temperature, cooling, or surface polish varies across the tool.", "Fill speed, pressure, or venting changes surface replication.", "Material moisture, additives, or colorant dispersion varies."], checkFirst: ["Compare gloss location to cavities, mold halves, water circuits, texture, and flow direction.", "Check mold temperature and fill speed repeatability."], actions: ["Balance mold temperature and cooling circuits.", "Restore fill speed/pressure needed for surface replication.", "Clean or repair tool surface and verify material/colorant condition."], processAreas: ["Mold temperature", "Cooling", "Fill speed", "Tool surface", "Venting"], materialChecks: ["Moisture", "Additive bloom", "Colorant", "Lot change"] },
  { name: "Contamination", slug: "contamination", description: "Foreign material, black specks, mixed resin, oil, dust, metal, or unexpected color appears in molded parts.", causes: ["Dirty loaders, grinders, hoses, hoppers, gaylords, or dryers.", "Wrong resin, colorant, purge compound, or regrind was introduced.", "Degraded polymer or tooling residue is breaking loose."], checkFirst: ["Quarantine suspect material and compare virgin resin, regrind, purge patties, and affected cavities.", "Inspect and clean the material path from storage through nozzle and hot runner."], actions: ["Purge and clean handling equipment, barrel, nozzle, and hot runner.", "Verify labels, lot traceability, regrind controls, and color-change procedure.", "Reduce degradation sources if contamination is burned resin."], processAreas: ["Material handling", "Purging", "Hot runner", "Residence time", "Housekeeping"], materialChecks: ["Wrong material", "Foreign debris", "Regrind", "Colorant", "Degradation"] },
];

export const troubleshootingHref = "/troubleshooting";
