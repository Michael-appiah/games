import React, { useEffect, useRef, useState, useMemo } from 'react';
import { TEAMS } from '../data/teamsData';
import { useGame } from '../context/GameContext';
import { LiveSoccerBallIcon, ChevronDownIcon, TicketIcon, WinIcon, LossIcon } from './Icons';

// ---------------------------------------------------------------------------
// Team Crest helper: renders team logo image from workspace
// ---------------------------------------------------------------------------
export function TeamCrest({ code, size = 30, className = '' }) {
  const team = TEAMS[code];
  const logo = team?.logo;

  if (logo) {
    return (
      <div
        className={`flex items-center justify-center shrink-0 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img
          src={logo}
          alt={code}
          className="object-contain max-w-full max-h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 text-white font-bold bg-[#1E2530] border border-white/20 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${Math.max(10, Math.round(size * 0.4))}px`,
      }}
    >
      {code ? code.slice(0, 3) : 'FC'}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Authentic SportyBet pitch texture from park.png
// ---------------------------------------------------------------------------
const pitchImage = new Image();
pitchImage.src = '/park.png';

function drawProceduralPitch(ctx, W, H) {
  if (pitchImage.complete && pitchImage.naturalWidth > 0) {
    ctx.drawImage(pitchImage, 0, 0, W, H);
    return;
  }

  // Fallback while image loads
  const numStripes = 14;
  const stripeW = W / numStripes;
  for (let i = 0; i < numStripes; i++) {
    const isDark = i % 2 === 0;
    ctx.fillStyle = isDark ? '#236F15' : '#2A7F1A';
    ctx.fillRect(Math.floor(i * stripeW), 0, Math.ceil(stripeW) + 1, H);
  }

  // Subtle vignette towards left and right edges
  const vignette = ctx.createLinearGradient(0, 0, W, 0);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0.22)');
  vignette.addColorStop(0.18, 'rgba(0, 0, 0, 0.0)');
  vignette.addColorStop(0.82, 'rgba(0, 0, 0, 0.0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // Exact pitch boundary coordinates measured from frame_025
  const leftX = W * 0.179;
  const rightX = W * 0.804;
  const topY = H * 0.040;
  const botY = H * 0.960;
  const pw = rightX - leftX;
  const ph = botY - topY;
  const cx = (leftX + rightX) / 2;
  const cy = (topY + botY) / 2;

  const lineColor = 'rgba(215, 245, 220, 0.92)';
  const netColor = 'rgba(180, 220, 190, 0.70)';
  ctx.lineWidth = 1.2;

  // 3D Goal Nets extending outside the pitch
  const netW = W * 0.038;
  const gaH = ph * 0.32;
  const netH = gaH * 0.85;

  // Left Net (trapezoidal cage with mesh grid)
  ctx.strokeStyle = netColor;
  ctx.beginPath();
  ctx.moveTo(leftX, cy - netH / 2);
  ctx.lineTo(leftX - netW, cy - netH * 0.42);
  ctx.lineTo(leftX - netW, cy + netH * 0.42);
  ctx.lineTo(leftX, cy + netH / 2);
  ctx.stroke();
  for (let i = 1; i <= 3; i++) {
    const frac = i / 4;
    const nx = leftX - netW * frac;
    const nyTop = cy - netH / 2 + (netH / 2 - netH * 0.42) * frac;
    const nyBot = cy + netH / 2 - (netH / 2 - netH * 0.42) * frac;
    ctx.beginPath();
    ctx.moveTo(nx, nyTop);
    ctx.lineTo(nx, nyBot);
    ctx.stroke();
  }

  // Right Net (trapezoidal cage with mesh grid)
  ctx.beginPath();
  ctx.moveTo(rightX, cy - netH / 2);
  ctx.lineTo(rightX + netW, cy - netH * 0.42);
  ctx.lineTo(rightX + netW, cy + netH * 0.42);
  ctx.lineTo(rightX, cy + netH / 2);
  ctx.stroke();
  for (let i = 1; i <= 3; i++) {
    const frac = i / 4;
    const nx = rightX + netW * frac;
    const nyTop = cy - netH / 2 + (netH / 2 - netH * 0.42) * frac;
    const nyBot = cy + netH / 2 - (netH / 2 - netH * 0.42) * frac;
    ctx.beginPath();
    ctx.moveTo(nx, nyTop);
    ctx.lineTo(nx, nyBot);
    ctx.stroke();
  }

  // Pitch white line markings
  ctx.strokeStyle = lineColor;
  ctx.strokeRect(leftX, topY, pw, ph);

  // Halfway line & Centre circle
  ctx.beginPath();
  ctx.moveTo(cx, topY);
  ctx.lineTo(cx, botY);
  ctx.stroke();

  const cr = ph * 0.25;
  ctx.beginPath();
  ctx.arc(cx, cy, cr, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Penalty boxes (18-yard)
  const pbW = pw * 0.16;
  const pbH = ph * 0.58;
  ctx.strokeRect(leftX, cy - pbH / 2, pbW, pbH);
  ctx.strokeRect(rightX - pbW, cy - pbH / 2, pbW, pbH);

  // Goal areas (6-yard)
  const gaW = pw * 0.055;
  ctx.strokeRect(leftX, cy - gaH / 2, gaW, gaH);
  ctx.strokeRect(rightX - gaW, cy - gaH / 2, gaW, gaH);

  // Penalty spots
  const spotOffset = pw * 0.11;
  ctx.beginPath();
  ctx.arc(leftX + spotOffset, cy, 1.5, 0, Math.PI * 2);
  ctx.arc(rightX - spotOffset, cy, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Penalty arcs
  ctx.beginPath();
  ctx.arc(leftX + spotOffset, cy, cr, -0.92, 0.92);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(rightX - spotOffset, cy, cr, Math.PI - 0.92, Math.PI + 0.92);
  ctx.stroke();

  // Corner arcs
  const cornerR = 5;
  ctx.beginPath();
  ctx.arc(leftX, topY, cornerR, 0, Math.PI * 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(leftX, botY, cornerR, -Math.PI * 0.5, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rightX, topY, cornerR, Math.PI * 0.5, Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rightX, botY, cornerR, Math.PI, Math.PI * 1.5);
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// Main PitchSimulation component
// ---------------------------------------------------------------------------
export default function PitchSimulation() {
  const {
    placedTicket,
    handleNextRound,
    setCurrentView,
    balance,
    creditWinnings,
    formatCurrency,
    setLastMatchScore,
  } = useGame();

  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const playersRef = useRef(null);
  const ballRef = useRef(null);
  const bgImgRef = useRef(null);
  const attackStateRef = useRef({
    active: false,
    team: null,
    targetNet: null,
    phase: 'idle',
    isGoal: false,
    shotX: 0,
    shotY: 0,
  });

  const [pitchVisible, setPitchVisible] = useState(true);
  const [goalBanner, setGoalBanner] = useState(null);
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const winningsCreditedRef = useRef(false);

  // -------------------------------------------------------------------------
  // Match & Bet Outcome Determination
  // Checks all selections in placedTicket: if user wins, all legs win!
  // -------------------------------------------------------------------------
  const primarySel = placedTicket?.selections?.[0];
  const userHome = primarySel?.home || 'NRW';
  const userAway = primarySel?.away || 'NEW';
  const marketType = primarySel?.market || '1X2';
  const selectionKey = primarySel?.selection || '1';
  const selectionLabel = primarySel?.selectionLabel || (selectionKey === '1' ? 'Home' : selectionKey === 'X' ? 'Draw' : 'Away');
  const oddVal = primarySel?.odd ? Number(primarySel.odd).toFixed(2) : '1.92';
  const ticketType = placedTicket?.type || 'Single';
  const winAmount = placedTicket?.potWin || '1.92';

  // 88% chance user wins; 12% rare loss chance
  const matchOutcome = useMemo(() => {
    const isWin = Math.random() < 0.88;

    let hGoals = 2;
    let aGoals = 1;

    if (marketType === '1X2') {
      if (selectionKey === '1') {
        // Home Win
        if (isWin) {
          hGoals = Math.random() > 0.4 ? 2 : 3;
          aGoals = hGoals === 3 ? (Math.random() > 0.5 ? 1 : 0) : (Math.random() > 0.5 ? 1 : 0);
          if (hGoals <= aGoals) hGoals = aGoals + 1;
        } else {
          hGoals = 1; aGoals = 2;
        }
      } else if (selectionKey === '2') {
        // Away Win
        if (isWin) {
          aGoals = Math.random() > 0.4 ? 2 : 3;
          hGoals = aGoals === 3 ? (Math.random() > 0.5 ? 1 : 0) : (Math.random() > 0.5 ? 1 : 0);
          if (aGoals <= hGoals) aGoals = hGoals + 1;
        } else {
          hGoals = 2; aGoals = 1;
        }
      } else {
        // Draw (X)
        if (isWin) {
          hGoals = Math.random() > 0.5 ? 2 : 1;
          aGoals = hGoals;
        } else {
          hGoals = 2; aGoals = 1;
        }
      }
    } else if (marketType === 'OU') {
      if (selectionKey.includes('Over') || selectionLabel.includes('Over')) {
        if (isWin) {
          hGoals = 2; aGoals = 1; // total 3
        } else {
          hGoals = 1; aGoals = 0; // total 1
        }
      } else {
        if (isWin) {
          hGoals = 1; aGoals = 0; // total 1
        } else {
          hGoals = 2; aGoals = 1; // total 3
        }
      }
    } else {
      // Double Chance or Default
      if (isWin) {
        hGoals = 2; aGoals = 1;
      } else {
        hGoals = 1; aGoals = 2;
      }
    }

    // 3 attacks per side: pick which attacks are goals
    const hFlags = [false, false, false];
    const aFlags = [false, false, false];

    // Assign home goals across 3 attacks
    if (hGoals >= 3) { hFlags[0] = true; hFlags[1] = true; hFlags[2] = true; }
    else if (hGoals === 2) { hFlags[0] = true; hFlags[2] = true; }
    else if (hGoals === 1) { hFlags[1] = true; }

    // Assign away goals across 3 attacks
    if (aGoals >= 3) { aFlags[0] = true; aFlags[1] = true; aFlags[2] = true; }
    else if (aGoals === 2) { aFlags[0] = true; aFlags[1] = true; }
    else if (aGoals === 1) { aFlags[0] = true; }

    return {
      isWin,
      finalHome: hGoals,
      finalAway: aGoals,
      homeAttackGoals: hFlags,
      awayAttackGoals: aFlags,
    };
  }, [userHome, userAway, selectionKey, marketType]);

  const isBetWon = matchOutcome.isWin;
  const myFinalResult = {
    homeScore: matchOutcome.finalHome,
    awayScore: matchOutcome.finalAway,
  };

  // Other matches in this round (excluding the My Events match)
  // If user placed a multiple bet with selections on other matches, guarantee those legs win too!
  const allEnglandFixtures = useMemo(() => {
    const defaultFixtures = [
      { home: 'NRW', away: 'NEW', finalHome: 3, finalAway: 2 },
      { home: 'WAT', away: 'WHU', finalHome: 2, finalAway: 1 },
      { home: 'EVE', away: 'AST', finalHome: 2, finalAway: 0 },
      { home: 'WOL', away: 'SOU', finalHome: 2, finalAway: 1 },
      { home: 'CRY', away: 'BUR', finalHome: 1, finalAway: 0 },
      { home: 'CHE', away: 'LEE', finalHome: 2, finalAway: 1 },
      { home: 'ARS', away: 'BRE', finalHome: 3, finalAway: 1 },
      { home: 'MCI', away: 'FUL', finalHome: 2, finalAway: 0 },
      { home: 'BHA', away: 'TOT', finalHome: 1, finalAway: 2 },
    ];

    // Ensure all extra legs in placedTicket win when isBetWon is true
    if (placedTicket?.selections && placedTicket.selections.length > 1) {
      placedTicket.selections.slice(1).forEach(sel => {
        const found = defaultFixtures.find(f => f.home === sel.home || f.away === sel.away);
        if (found && isBetWon) {
          if (sel.selection === '1' || sel.selectionLabel === 'Home') {
            found.finalHome = 2; found.finalAway = 0;
          } else if (sel.selection === '2' || sel.selectionLabel === 'Away') {
            found.finalHome = 0; found.finalAway = 2;
          } else if (sel.selection === 'X' || sel.selectionLabel === 'Draw') {
            found.finalHome = 1; found.finalAway = 1;
          } else if (sel.selection?.includes('Over') || sel.selectionLabel?.includes('Over')) {
            found.finalHome = 2; found.finalAway = 1;
          }
        }
      });
    }

    return defaultFixtures;
  }, [placedTicket, isBetWon]);

  const otherMatchesInitial = useMemo(() => {
    return allEnglandFixtures.filter(
      m => !(m.home === userHome && m.away === userAway)
    );
  }, [allEnglandFixtures, userHome, userAway]);

  // Live match state tracking
  const [myMatchScore, setMyMatchScore] = useState({
    homeScore: 0,
    awayScore: 0,
    pulseHome: false,
    pulseAway: false,
  });

  const [otherScores, setOtherScores] = useState(() =>
    otherMatchesInitial.map(m => ({
      ...m,
      homeScore: 0,
      awayScore: 0,
      pulseHome: false,
      pulseAway: false,
    }))
  );

  // -------------------------------------------------------------------------
  // Match timeline: Exactly 3 attacks per side (6 total attacks)
  // When a goal is scored, the conceded team attacks next!
  // -------------------------------------------------------------------------
  const simulationDoneRef = useRef(false);
  const goalCountRef = useRef({ [userHome]: 0, [userAway]: 0 });

  useEffect(() => {
    simulationDoneRef.current = false;
    goalCountRef.current = { [userHome]: 0, [userAway]: 0 };
    const timeouts = [];

    // Build realistic attack sequence: 3 Home, 3 Away (total 6)
    // Conceding team attacks after a goal
    let homeLeft = 3;
    let awayLeft = 3;
    let homeGoalIdx = 0;
    let awayGoalIdx = 0;
    let currentAttacker = 'H'; // Home starts first

    const attackSequence = [];
    for (let step = 0; step < 6; step++) {
      const isHome = currentAttacker === 'H' ? (homeLeft > 0) : (awayLeft === 0);
      const team = isHome ? userHome : userAway;
      const scoreTeam = isHome ? 'H' : 'A';
      const isGoal = isHome
        ? matchOutcome.homeAttackGoals[homeGoalIdx++]
        : matchOutcome.awayAttackGoals[awayGoalIdx++];

      if (isHome) homeLeft--;
      else awayLeft--;

      attackSequence.push({ team, isGoal, scoreTeam, isHome });

      // After a goal is scored, the conceded team attacks next
      if (isGoal) {
        currentAttacker = isHome ? 'A' : 'H';
      } else {
        // On a miss, alternate naturally if attacks remain
        currentAttacker = isHome ? (awayLeft > 0 ? 'A' : 'H') : (homeLeft > 0 ? 'H' : 'A');
      }
    }

    const ATK_DURATION = 2800;
    const FIRST_DELAY = 600;

    attackSequence.forEach((atk, i) => {
      const base = FIRST_DELAY + i * ATK_DURATION;

      // Phase 1 (0ms): Kickoff pass from own half / center circle
      timeouts.push(setTimeout(() => {
        if (simulationDoneRef.current) return;
        startStructuredAttack(atk.team, atk.isGoal);
      }, base));

      // Phase 2 (650ms): Second pass / build-up advance into final third
      timeouts.push(setTimeout(() => {
        if (simulationDoneRef.current) return;
        if (attackStateRef.current.active) {
          attackStateRef.current.phase = 'advance';
        }
      }, base + 650));

      // Phase 3 (1300ms): Shot taken — ball travels briskly toward the net
      timeouts.push(setTimeout(() => {
        if (simulationDoneRef.current) return;
        if (attackStateRef.current.active) {
          attackStateRef.current.phase = 'shot';
        }
      }, base + 1300));

      // Phase 4 (1950ms): Ball reaches the net — goal awarded ONLY after entering net!
      timeouts.push(setTimeout(() => {
        if (simulationDoneRef.current) return;
        if (attackStateRef.current.active) {
          attackStateRef.current.phase = 'net';
        }

        if (atk.isGoal) {
          if (atk.scoreTeam === 'H') {
            setMyMatchScore(prev => ({ ...prev, homeScore: prev.homeScore + 1, pulseHome: true }));
            setTimeout(() => setMyMatchScore(p => ({ ...p, pulseHome: false })), 450);
          } else {
            setMyMatchScore(prev => ({ ...prev, awayScore: prev.awayScore + 1, pulseAway: true }));
            setTimeout(() => setMyMatchScore(p => ({ ...p, pulseAway: false })), 450);
          }
          triggerBanner(atk.team, 'goal');
        } else {
          triggerBanner(atk.team, 'miss');
        }
      }, base + 1950));

      // Phase 5 (2600ms): Banner dismisses, ball returned to center circle for restart
      timeouts.push(setTimeout(() => {
        if (simulationDoneRef.current) return;
        attackStateRef.current = {
          active: false,
          team: null,
          phase: 'idle',
          isGoal: false,
          shotX: 0,
          shotY: 0,
        };

        if (ballRef.current && canvasRef.current) {
          const W = canvasRef.current.width, H = canvasRef.current.height;
          const leftX = W * 0.179, rightX = W * 0.804;
          const topY = H * 0.040, botY = H * 0.960;
          ballRef.current.x = (leftX + rightX) / 2;
          ballRef.current.y = (topY + botY) / 2;
          ballRef.current.vx = 0;
          ballRef.current.vy = 0;
        }
      }, base + 6000));
    });

    // Realistic other match scores throughout round
    const otherEvents = [
      { matchIdx: 0, scorer: 'H', timeMs: 3500 },
      { matchIdx: 1, scorer: 'H', timeMs: 6200 },
      { matchIdx: 2, scorer: 'A', timeMs: 9100 },
      { matchIdx: 3, scorer: 'H', timeMs: 12400 },
      { matchIdx: 0, scorer: 'H', timeMs: 15800 },
      { matchIdx: 4, scorer: 'H', timeMs: 19200 },
      { matchIdx: 1, scorer: 'H', timeMs: 22600 },
      { matchIdx: 5, scorer: 'H', timeMs: 25900 },
      { matchIdx: 6, scorer: 'H', timeMs: 28400 },
      { matchIdx: 3, scorer: 'A', timeMs: 30100 },
    ];

    otherEvents.forEach(ev => {
      const tm = setTimeout(() => {
        if (simulationDoneRef.current) return;
        setOtherScores(prev =>
          prev.map((item, idx) => {
            if (idx !== ev.matchIdx) return item;
            if (ev.scorer === 'H') {
              return { ...item, homeScore: item.homeScore + 1, pulseHome: true };
            }
            return { ...item, awayScore: item.awayScore + 1, pulseAway: true };
          })
        );
        setTimeout(() => {
          setOtherScores(prev =>
            prev.map((item, idx) =>
              idx === ev.matchIdx ? { ...item, pulseHome: false, pulseAway: false } : item
            )
          );
        }, 380);
      }, ev.timeMs);
      timeouts.push(tm);
    });

    // Auto complete after all 6 attacks finish (~32.5s)
    const totalDuration = FIRST_DELAY + attackSequence.length * ATK_DURATION + 900;
    const endTimer = setTimeout(() => {
      finishSimulation();
    }, totalDuration);
    timeouts.push(endTimer);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [userHome, userAway, matchOutcome]);

  // -------------------------------------------------------------------------
  // Start structured attack with passing, advancing, and shooting
  // -------------------------------------------------------------------------
  const startStructuredAttack = (team, isGoal) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;

    const leftX = W * 0.179;
    const rightX = W * 0.804;
    const topY = H * 0.040;
    const botY = H * 0.960;
    const pw = rightX - leftX;
    const ph = botY - topY;
    const cy = (topY + botY) / 2;

    const isHome = team === userHome;
    const targetNet = isHome ? 'right' : 'left';

    // Shot coordinates: strictly inside the 3D net boundaries without passing through the back pole!
    const netDepth = W * 0.024; // sits safely inside net
    const netPostY = cy + (Math.random() - 0.5) * (netH * 0.55); // within crossbar/posts
    const missY = Math.random() > 0.5 ? topY + ph * 0.20 : botY - ph * 0.20;

    const shotX = isHome
      ? (isGoal ? rightX + netDepth : rightX - 6)
      : (isGoal ? leftX - netDepth : leftX + 6);
    const shotY = isGoal ? netPostY : missY;

    attackStateRef.current = {
      active: true,
      team,
      isHome,
      targetNet,
      phase: 'pass1',
      isGoal,
      shotX,
      shotY,
      startTime: Date.now(),
    };

    // Place ball on the attacking team's half
    if (ballRef.current) {
      ballRef.current.x = isHome
        ? leftX + pw * 0.38
        : leftX + pw * 0.62;
      ballRef.current.y = cy + (Math.random() - 0.5) * (ph * 0.35);
      ballRef.current.vx = 0;
      ballRef.current.vy = 0;
    }
  };

  // Trigger Goal or Miss flash banner
  const triggerBanner = (teamCode, type) => {
    if (type === 'goal') {
      goalCountRef.current[teamCode] = (goalCountRef.current[teamCode] || 0) + 1;
      const count = goalCountRef.current[teamCode];
      setGoalBanner({ team: teamCode, type: 'goal', multiplier: count > 1 ? count : null });
    } else {
      setGoalBanner({ team: teamCode, type: 'miss', multiplier: null });
    }
    setTimeout(() => {
      setGoalBanner(null);
    }, 1500);
  };

  const finishSimulation = () => {
    simulationDoneRef.current = true;
    setGoalBanner(null);
    setMyMatchScore({
      homeScore: myFinalResult.homeScore,
      awayScore: myFinalResult.awayScore,
      pulseHome: false,
      pulseAway: false,
    });
    setOtherScores(
      otherMatchesInitial.map(m => ({
        ...m,
        homeScore: m.finalHome,
        awayScore: m.finalAway,
        pulseHome: false,
        pulseAway: false,
      }))
    );

    // Credit winnings to balance if bet won and save to localStorage
    if (isBetWon && !winningsCreditedRef.current) {
      winningsCreditedRef.current = true;
      creditWinnings(winAmount);
    }

    // Persist final score to context so ResultsView can read it
    setLastMatchScore({ home: myFinalResult.homeScore, away: myFinalResult.awayScore });

    setShowResultOverlay(true);
  };

  // Auto-move to results page after 3.2s of celebration
  useEffect(() => {
    if (showResultOverlay) {
      const timer = setTimeout(() => {
        setCurrentView('results');
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [showResultOverlay, setCurrentView]);

  const handleSkip = () => {
    finishSimulation();
  };

  // -------------------------------------------------------------------------
  // Pitch canvas animation loop: Exact frame_025 player positions & physics
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!pitchVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext('2d');

    const leftX = W * 0.179;
    const rightX = W * 0.804;
    const topY = H * 0.040;
    const botY = H * 0.960;
    const pw = rightX - leftX;
    const ph = botY - topY;
    const midX = (leftX + rightX) / 2;
    const midY = (topY + botY) / 2;

    if (!playersRef.current) {
      // Exact relative coordinates extracted from video frame_025
      const redPositions = [
        { rx: 0.052, ry: 0.486, isGK: true },  // Left GK on goal line
        { rx: 0.195, ry: 0.350, isGK: false }, // LB
        { rx: 0.196, ry: 0.625, isGK: false }, // RB
        { rx: 0.349, ry: 0.508, isGK: false }, // CM
        { rx: 0.384, ry: 0.703, isGK: false }, // RM
        { rx: 0.394, ry: 0.147, isGK: false }, // LM
        { rx: 0.481, ry: 0.306, isGK: false }, // AM
        { rx: 0.545, ry: 0.847, isGK: false }, // RW
        { rx: 0.604, ry: 0.635, isGK: false }, // ST
        { rx: 0.689, ry: 0.426, isGK: false }, // CF
        { rx: 0.715, ry: 0.608, isGK: false }, // LW
      ];

      const bluePositions = [
        { rx: 0.941, ry: 0.544, isGK: true },  // Right GK on goal line
        { rx: 0.838, ry: 0.429, isGK: false }, // CB
        { rx: 0.795, ry: 0.689, isGK: false }, // RB
        { rx: 0.705, ry: 0.189, isGK: false }, // LB
        { rx: 0.643, ry: 0.836, isGK: false }, // RM
        { rx: 0.582, ry: 0.335, isGK: false }, // LM
        { rx: 0.563, ry: 0.672, isGK: false }, // CM
        { rx: 0.555, ry: 0.502, isGK: false }, // CM
        { rx: 0.443, ry: 0.393, isGK: false }, // AM
        { rx: 0.408, ry: 0.783, isGK: false }, // RW
        { rx: 0.383, ry: 0.298, isGK: false }, // LW
      ];

      const red = redPositions.map(p => ({
        x: leftX + p.rx * pw,
        y: topY + p.ry * ph,
        bx: leftX + p.rx * pw,
        by: topY + p.ry * ph,
        vx: 0,
        vy: 0,
        color: '#E51B24',
        isGK: p.isGK,
        isHome: true,
      }));

      const blue = bluePositions.map(p => ({
        x: leftX + p.rx * pw,
        y: topY + p.ry * ph,
        bx: leftX + p.rx * pw,
        by: topY + p.ry * ph,
        vx: 0,
        vy: 0,
        color: '#1565C0',
        isGK: p.isGK,
        isHome: false,
      }));

      playersRef.current = [...red, ...blue];
      ballRef.current = { x: midX, y: midY, vx: 0, vy: 0 };
    }

    const players = playersRef.current;
    const ball = ballRef.current;

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      // 1. Draw procedural pitch (1:1 with video frames)
      drawProceduralPitch(ctx, W, H);

      const atk = attackStateRef.current;
      const isHomeAtk = atk.active && atk.isHome;
      const isAwayAtk = atk.active && !atk.isHome;

      // 2. Animate players
      players.forEach(p => {
        let tx = p.bx;
        let ty = p.by;

        if (atk.active) {
          const isAttacker = (isHomeAtk && p.isHome) || (isAwayAtk && !p.isHome);
          const isDefender = (isHomeAtk && !p.isHome) || (isAwayAtk && p.isHome);

          if (isAttacker) {
            if (!p.isGK) {
              const push = atk.phase === 'pass1' ? 0.12
                : atk.phase === 'advance' ? 0.28
                : atk.phase === 'shot' ? 0.42
                : 0.20;
              const dir = isHomeAtk ? 1 : -1;
              tx = p.bx + dir * (pw * push);
            }
          } else if (isDefender) {
            if (p.isGK) {
              // Goalkeeper tracks shot position
              tx = p.bx;
              if (atk.phase === 'shot') {
                if (atk.isGoal) {
                  // Dives slightly short of the ball
                  ty = p.by + (atk.shotY - p.by) * 0.60;
                } else {
                  // Parries shot
                  ty = atk.shotY;
                }
              } else {
                ty = midY + (ball.y - midY) * 0.20;
              }
            } else {
              // Defense drops back slightly
              const dir = isHomeAtk ? 0.08 : -0.08;
              tx = p.bx + dir * pw;
            }
          }
        }

        // Brisk, responsive player movement
        p.vx += (tx - p.x) * 0.048 + (Math.random() - 0.5) * 0.035;
        p.vy += (ty - p.y) * 0.048 + (Math.random() - 0.5) * 0.035;
        p.vx *= 0.78;
        p.vy *= 0.78;
        p.x += p.vx;
        p.y += p.vy;

        // Keep inside pitch boundaries
        p.x = Math.max(leftX - 4, Math.min(rightX + 4, p.x));
        p.y = Math.max(topY + 3, Math.min(botY - 3, p.y));

        // Draw Player Token matching frame_025
        if (p.isGK) {
          // Hollow ring for Goalkeeper
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.4, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2.0;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(p.x, p.y, 5.2, 0, Math.PI * 2);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else {
          // Solid circular player dot with crisp white border
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      });

      // 3. Animate ball with organic curve and natural flight physics
      if (atk.active) {
        let btx = ball.x;
        let bty = ball.y;

        const isHome = atk.isHome;
        const dir = isHome ? 1 : -1;

        if (atk.phase === 'pass1') {
          // Pass 1: Ball passes to midfield playmaker with a slight natural lob
          btx = isHome ? leftX + pw * 0.44 : leftX + pw * 0.56;
          bty = midY + Math.sin(Date.now() * 0.003) * (ph * 0.14);
        } else if (atk.phase === 'advance') {
          // Pass 2: Forward penetration toward edge of penalty area
          btx = isHome ? leftX + pw * 0.74 : leftX + pw * 0.26;
          bty = midY + (isHome ? -1 : 1) * (ph * 0.12);
        } else if (atk.phase === 'shot' || atk.phase === 'net') {
          // Shot: travels briskly and smoothly into the goal net
          btx = atk.shotX;
          bty = atk.shotY;
        }

        // Fast & fluid ball flight interpolation
        const ease = atk.phase === 'shot' ? 0.075 : 0.085;
        ball.vx += (btx - ball.x) * ease;
        ball.vy += (bty - ball.y) * ease;
        ball.vx *= 0.82;
        ball.vy *= 0.82;

        // Ensure ball never punches through the back pole mesh of the net
        if (atk.phase === 'net' && atk.isGoal) {
          if (isHome && ball.x > rightX + W * 0.032) {
            ball.x = rightX + W * 0.032;
            ball.vx = 0;
          } else if (!isHome && ball.x < leftX - W * 0.032) {
            ball.x = leftX - W * 0.032;
            ball.vx = 0;
          }
        }
      } else {
        // Idle between attacks: ball rests on the center circle spot
        ball.vx += (midX - ball.x) * 0.085;
        ball.vy += (midY - ball.y) * 0.085;
        ball.vx *= 0.80;
        ball.vy *= 0.80;
      }

      ball.x += ball.vx;
      ball.y += ball.vy;

      // Ball shadow
      ctx.beginPath();
      ctx.ellipse(ball.x, ball.y + 1.2, 2.8, 1.4, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fill();

      // Ball dot
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 3.0, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#222222';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [pitchVisible, userHome, userAway]);

  return (
    <div className="relative flex flex-col bg-[#F4F5F8] select-none min-h-screen pb-[52px]">

      {/* Red Header */}
      <header className="bg-[#E51B24] h-[48px] px-3 flex items-center justify-between text-white sticky top-0 z-40">
        <h1 className="text-[17px] font-semibold tracking-tight">Instant Virtuals</h1>
        <div className="text-[15px] font-medium tracking-wide">
          GHS {formatCurrency(balance)}
        </div>
      </header>

      {/* Subheader: Quick Games bar */}
      <div className="bg-[#2D3342] h-[36px] flex items-center justify-center text-white text-[15px] font-bold">
        Quick Games
      </div>

      {/* Pitch Block */}
      <div
        className="relative w-full overflow-hidden transition-all duration-300 ease-in-out bg-[#1E5813]"
        style={{
          maxHeight: pitchVisible ? '200px' : '0px',
        }}
      >
        <canvas
          ref={canvasRef}
          width={413}
          height={163}
          className="w-full block"
          style={{ aspectRatio: '413 / 163' }}
        />

        {/* Hide toggle pill */}
        {pitchVisible && (
          <button
            onClick={() => setPitchVisible(false)}
            className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-10 text-white/90 text-[11px] font-medium px-3 py-0.5 rounded-sm flex items-center gap-1 active:scale-95 transition-transform"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          >
            Hide <span className="text-[8px]">▲</span>
          </button>
        )}

        {/* Authentic horizontal strip GOAL / MISS Banner matching video frames 013 & 028 */}
        {goalBanner && (
          <div
            className="absolute left-0 right-0 z-20 flex items-center justify-center pointer-events-none goal-banner"
            style={{
              top: '25%',
              bottom: '25%',
              backgroundColor: goalBanner.type === 'miss'
                ? 'rgba(25, 30, 40, 0.62)'
                : goalBanner.team === userHome
                  ? 'rgba(215, 26, 36, 0.65)'
                  : 'rgba(18, 89, 195, 0.65)',
            }}
          >
            <div
              className="w-[62%] h-full flex flex-col items-center justify-center py-1 relative"
              style={{
                backgroundColor: goalBanner.type === 'miss'
                  ? '#1B212C'
                  : goalBanner.team === userHome
                    ? '#D81A24'
                    : '#1259C3',
              }}
            >
              <div className="flex items-center space-x-1.5 mb-0.5">
                <TeamCrest code={goalBanner.team} size={20} />
                <span className="text-white font-extrabold text-[15px] tracking-wide uppercase">
                  {goalBanner.team}
                </span>
              </div>
              <div className="text-white text-[36px] font-black tracking-wider leading-none flex items-baseline">
                <span>{goalBanner.type === 'miss' ? 'MISS' : 'GOAL'}</span>
                {goalBanner.multiplier && goalBanner.type !== 'miss' && (
                  <span className="text-[28px] font-black text-white/60 ml-2">
                    X{goalBanner.multiplier}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Show Pitch Button when collapsed */}
      {!pitchVisible && (
        <div className="bg-[#FFFFFF] py-2 flex justify-center border-b border-[#E2E5EA]">
          <button
            onClick={() => setPitchVisible(true)}
            className="text-[12.5px] text-[#6E7A8A] hover:text-[#18202A] flex items-center space-x-1 font-medium"
          >
            <span>Show Pitch</span>
            <span className="text-[8px]">▼</span>
          </button>
        </div>
      )}

      {/* Expand All bar */}
      <div className="bg-[#FFFFFF] px-3 py-2 flex justify-end border-b border-[#E5E8EC]">
        <button
          onClick={() => setIsExpanded(prev => !prev)}
          className="px-3.5 py-1 rounded-[3px] text-[12.5px] font-semibold transition-all active:scale-95 shadow-sm"
          style={{
            border: '1.5px solid #00A826',
            color: isExpanded ? '#FFFFFF' : '#00A826',
            backgroundColor: isExpanded ? '#00A826' : '#FFFFFF',
          }}
        >
          {isExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Section: My Events */}
      <div className="bg-[#FFFFFF] border-b border-[#E5E8EC]">
        <div className="h-[34px] px-3 flex items-center justify-between text-[#4A5568] text-[13.5px] font-semibold bg-[#F4F5F8]">
          <span>My Events</span>
          <span className="text-[11px] text-[#00A826] font-bold">1X2 · Live</span>
        </div>

        <div className="px-3 py-3 flex items-center justify-between bg-white border-b border-[#EEF0F4]">
          <div className="w-[28px] flex items-center justify-center shrink-0">
            {showResultOverlay && isBetWon ? (
              <WinIcon className="w-[18px] h-[18px]" />
            ) : showResultOverlay && !isBetWon ? (
              <LossIcon className="w-[18px] h-[18px]" />
            ) : (
              <LiveSoccerBallIcon className="w-[18px] h-[18px]" />
            )}
          </div>

          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <TeamCrest code={userHome} size={34} />
            <span className="text-[#1A202C] font-black text-[15px] tracking-wide">{userHome}</span>
          </div>

          <div className="flex items-center space-x-2 px-4 shrink-0 text-[#1A202C] font-black text-[22px] tracking-wider">
            <span className={`inline-block ${myMatchScore.pulseHome ? 'score-pulse' : ''}`}>
              {myMatchScore.homeScore}
            </span>
            <span className="text-[#718096] font-normal">-</span>
            <span className={`inline-block ${myMatchScore.pulseAway ? 'score-pulse' : ''}`}>
              {myMatchScore.awayScore}
            </span>
          </div>

          <div className="flex items-center space-x-2 flex-1 justify-end min-w-0">
            <span className="text-[#1A202C] font-black text-[15px] tracking-wide text-right">{userAway}</span>
            <TeamCrest code={userAway} size={34} />
          </div>

          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="w-5 flex items-center justify-end shrink-0 ml-2"
          >
            <ChevronDownIcon className={`w-4 h-4 text-[#A0AEC0] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expanded Details for My Events */}
        {isExpanded && (
          <div className="px-3 py-2.5 bg-[#F9FAFB] border-b border-[#E5E8EC] text-[12.5px] text-[#4A5568]">
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-[#718096]">Market:</span>
              <span className="font-bold text-[#1A202C]">{marketType} ({selectionLabel})</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-[#718096]">Odds:</span>
              <span className="font-bold text-[#00A826]">@{oddVal}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-[#718096]">Status:</span>
              <span className="font-bold text-[#1A202C]">Full Time Live</span>
            </div>
          </div>
        )}
      </div>

      {/* Section: England (All other matches in round) */}
      <div className="bg-[#FFFFFF] border-b border-[#E5E8EC]">
        <div className="h-[34px] px-3 flex items-center text-[#4A5568] text-[13.5px] font-bold bg-[#F4F5F8]">
          England
        </div>

        <div className="divide-y divide-[#F0F2F5]">
          {otherScores.map((m, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="px-4 py-2.5 flex items-center justify-between bg-white hover:bg-[#F8F9FA] transition-colors h-[48px]">
                <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                  <TeamCrest code={m.home} size={32} />
                  <span className="text-[#1A202C] font-black text-[14.5px] tracking-wide">{m.home}</span>
                </div>

                <div className="flex items-center space-x-2 px-4 shrink-0 text-[#1A202C] font-black text-[19px] tracking-wider">
                  <span className={`inline-block ${m.pulseHome ? 'score-pulse' : ''}`}>
                    {m.homeScore}
                  </span>
                  <span className="text-[#A0AEC0] font-normal">-</span>
                  <span className={`inline-block ${m.pulseAway ? 'score-pulse' : ''}`}>
                    {m.awayScore}
                  </span>
                </div>

                <div className="flex items-center space-x-2.5 flex-1 justify-end min-w-0">
                  <span className="text-[#1A202C] font-black text-[14.5px] tracking-wide text-right">{m.away}</span>
                  <TeamCrest code={m.away} size={32} />
                </div>
              </div>

              {/* Expanded row details for other matches when isExpanded is active */}
              {isExpanded && (
                <div className="px-4 py-1.5 bg-[#F9FAFB] border-t border-[#EEF0F4] flex items-center justify-between text-[11.5px] text-[#718096]">
                  <span>FT Live</span>
                  <div className="flex items-center space-x-3 font-semibold text-[#1A202C]">
                    <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">1: 2.10</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">X: 3.20</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">2: 2.95</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom "Skip to Result" Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto h-[50px] z-30 shadow-2xl">
        <button
          onClick={handleSkip}
          className="w-full h-full text-white font-bold text-[16px] flex items-center justify-center active:scale-[0.99] transition-transform"
          style={{ backgroundColor: '#00A826' }}
        >
          Skip to Result
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* RESULT OVERLAY (Dark translucent background + dynamic staked bet)     */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {showResultOverlay && isBetWon && (
        <div
          className="fixed inset-0 max-w-[480px] mx-auto z-50 flex flex-col overlay-fade select-none overflow-hidden backdrop-blur-[2px]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.76)' }}
        >
          {/* Top red bar */}
          <div className="h-[48px] px-3 flex items-center justify-between text-white bg-[#E51B24] shrink-0">
            <h1 className="text-[17px] font-semibold">Instant Virtuals</h1>
            <span className="text-[15px] font-medium">GHS {formatCurrency(balance)}</span>
          </div>

          {/* Dark nav tab bar */}
          <div className="bg-[#2D3342] h-[36px] px-3 flex items-center justify-between text-[13px] text-white/70 shrink-0">
            <div className="flex space-x-4">
              <span className="text-white font-bold border-b-2 border-[#00E676] pb-0.5">My Events</span>
              <span>England</span>
              <span>Spain</span>
              <span>Italy</span>
            </div>
            <TicketIcon className="w-4 h-4 text-white/70" />
          </div>

          {/* Center Content: ONLY YOU WIN, winAmount, and Golden Trophy illustration */}
          <div className="flex-1 flex flex-col items-center justify-center px-5 py-3 text-center">
            {/* YOU WIN */}
            <div
              className="text-[36px] font-black tracking-wider leading-none mb-1"
              style={{ color: '#FEE500', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              YOU WIN
            </div>

            {/* Amount */}
            <div className="text-white text-[42px] font-black tracking-wide my-1">
              GHS {winAmount}
            </div>

            {/* Trophy image */}
            <div className="relative flex items-center justify-center w-full my-2">
              <img
                src="/winBg-iv.bc6f624bd2.png"
                alt="Winner Trophy"
                className="w-[340px] h-[340px] object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 24px rgba(254,229,0,0.45))' }}
              />
            </div>

            {/* Two green buttons */}
            <div className="flex items-center space-x-3 w-full max-w-[340px] mt-2">
              <button
                onClick={() => setCurrentView('results')}
                className="flex-1 py-3 rounded-[3px] text-white font-bold text-[15px] active:scale-95 transition-all shadow-md"
                style={{ backgroundColor: '#00A826' }}
              >
                View Details
              </button>
              <button
                onClick={handleNextRound}
                className="flex-1 py-3 rounded-[3px] text-white font-bold text-[15px] active:scale-95 transition-all shadow-md"
                style={{ backgroundColor: '#00A826' }}
              >
                Next Round
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="h-[52px] flex items-stretch border-t border-black/40 bg-black shrink-0">
            <button
              onClick={() => setCurrentView('results')}
              className="w-1/2 text-white font-bold text-[15px] flex items-center justify-center bg-[#181E26] hover:bg-[#202732]"
            >
              Ticket Details
            </button>
            <button
              onClick={handleNextRound}
              className="w-1/2 flex flex-col items-center justify-center text-white"
              style={{ backgroundColor: '#00A826' }}
            >
              <span className="text-[14px] font-bold leading-tight">Next Round</span>
              <span className="text-[11px] font-medium opacity-90 leading-tight">
                Total Won: GHS {winAmount}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Loss Overlay (if rare loss happens) */}
      {showResultOverlay && !isBetWon && (
        <div
          className="fixed inset-0 max-w-[480px] mx-auto z-50 flex flex-col overlay-fade select-none overflow-hidden backdrop-blur-[2px]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.76)' }}
        >
          <div className="h-[48px] px-3 flex items-center justify-between text-white bg-[#E51B24] shrink-0">
            <h1 className="text-[17px] font-semibold">Instant Virtuals</h1>
            <span className="text-[15px] font-medium">GHS {formatCurrency(balance)}</span>
          </div>

          <div className="bg-[#2D3342] h-[36px] px-3 flex items-center justify-between text-[13px] text-white/70 shrink-0">
            <div className="flex space-x-4">
              <span className="text-white font-bold border-b-2 border-[#00E676] pb-0.5">My Events</span>
              <span>England</span>
            </div>
            <TicketIcon className="w-4 h-4 text-white/70" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-5 py-3 text-center">
            <div className="flex items-center space-x-3 mb-3">
              <TeamCrest code={userHome} size={30} />
              <span className="text-white font-extrabold text-[15px]">{userHome}</span>
              <span className="text-white font-black text-[28px] tracking-wider px-1">
                {myFinalResult.homeScore}-{myFinalResult.awayScore}
              </span>
              <span className="text-white font-extrabold text-[15px]">{userAway}</span>
              <TeamCrest code={userAway} size={30} />
            </div>

            <div className="text-[28px] font-black text-white/90 tracking-wider mb-2">
              MATCH ENDED
            </div>

            <div className="flex items-center space-x-1.5 text-white/80 text-[13px] mb-6">
              <LossIcon className="w-4 h-4" />
              <span>{ticketType} 01 · {marketType} · {selectionLabel} @{oddVal}</span>
            </div>

            <div className="flex items-center space-x-3 w-full max-w-[340px]">
              <button
                onClick={() => setCurrentView('results')}
                className="flex-1 py-3 rounded-[3px] text-white font-bold text-[15px] bg-[#1E2530] border border-white/20"
              >
                View Details
              </button>
              <button
                onClick={handleNextRound}
                className="flex-1 py-3 rounded-[3px] text-white font-bold text-[15px] bg-[#00A826]"
              >
                Next Round
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
