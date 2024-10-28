import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import "./FlashingCount.css";

const FlashingCount = ({ count }) => {
    const [flashColor, setFlashColor] = useState(null); // current flash color
    const prevCountRef = useRef(count); // previous count
    const timeoutRef = useRef(null); // ref for timeout

    useEffect(() => {
        if (prevCountRef.current !== count) {
            if (count > prevCountRef.current) {
                setFlashColor("flash-green"); // increase flash
            } else if (count < prevCountRef.current) {
                setFlashColor("flash-red"); // decrease flash
            }
            prevCountRef.current = count;

            // clear existing timeouts to handle rapid changes
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setFlashColor(null); // reset flash after animation
            }, 1000);
        }
    }, [count]);

    return <span className={clsx("flashing-count", flashColor)}>{count}</span>;
};

FlashingCount.propTypes = {
    count: PropTypes.number.isRequired,
};

export default FlashingCount;
