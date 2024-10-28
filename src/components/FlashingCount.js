import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import "./FlashingCount.css";

const FlashingCount = ({ count }) => {
    const [flashColor, setFlashColor] = useState(null);
    const prevCountRef = useRef(count);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (prevCountRef.current !== count) {
            if (count > prevCountRef.current) {
                setFlashColor("flash-green");
            } else if (count < prevCountRef.current) {
                setFlashColor("flash-red");
            }
            prevCountRef.current = count;

            // clear existing timeouts to handle rapid changes
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setFlashColor(null);
            }, 1000);
        }
    }, [count]);

    return <span className={clsx("flashing-count", flashColor)}>{count}</span>;
};

FlashingCount.propTypes = {
    count: PropTypes.number.isRequired,
};

export default FlashingCount;
