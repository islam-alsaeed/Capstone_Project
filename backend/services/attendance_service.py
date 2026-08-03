ALLOWED_TRANSITIONS = {
    None: {
        "CHECK_IN",
    },
    "CHECK_IN": {
        "BREAK_START",
        "LUNCH_START",
        "CHECK_OUT",
    },
    "BREAK_START": {
        "BREAK_END",
    },
    "BREAK_END": {
        "BREAK_START",
        "LUNCH_START",
        "CHECK_OUT",
    },
    "LUNCH_START": {
        "LUNCH_END",
    },
    "LUNCH_END": {
        "BREAK_START",
        "LUNCH_START",
        "CHECK_OUT",
    },
    "CHECK_OUT": {
        "CHECK_IN",
    },
}


def validate_attendance_transition(
    latest_event_type: str | None,
    requested_event_type: str,
) -> None:
    allowed_events = ALLOWED_TRANSITIONS.get(
        latest_event_type,
        set(),
    )

    if requested_event_type not in allowed_events:
        previous_event = (
            latest_event_type or "NO_PREVIOUS_EVENT"
        )

        raise ValueError(
            f"Cannot record {requested_event_type} "
            f"after {previous_event}."
        )