import { dcs_mapping } from '../../../../config/json_visualization_dcs_bit_mapping';

const getWhichSubsystemDCSBelongsTo = (dcs_var) => {
  for (const [subsystem, dcs_vars] of Object.entries(dcs_mapping)) {
    if (dcs_vars.includes(dcs_var)) {
      return subsystem;
    }
  }
  return 'unknown';
};

const generateData = (rules_flagged_false_combination_luminosity) => {
  // ONLY DCS:
  let dcs_lumi_losses = {};
  let dcs_lumi_losses_runs = {};
  let dcs_lumi_loss_total = 0;

  // DCS grouped per subsystem:
  let subsystem_dcs_losses = {};
  let subsystem_dcs_losses_runs = {};
  let subsystem_lumi_loss_total = 0;

  // RR Quality:
  let rr_lumi_losses = {};
  let rr_lumi_losses_runs = {};
  let rr_lumi_loss_total = 0;

  // RR Quality per subsystem:
  let subsystem_rr_losses = {};
  let subsystem_rr_losses_runs = {};
  let subsystem_rr_loss = 0;

  // Both:
  let inclusive_losses = {};
  let inclusive_losses_runs = {};
  let inclusive_loss = 0;

  // Exclusive losses
  let exclusive_losses = {
    mixed: 0,
  };
  let exclusive_losses_runs = {
    mixed: {},
  };
  let exclusive_loss = 0;

  for (const [key, val] of Object.entries(
    rules_flagged_false_combination_luminosity
  )) {
    const vars = getVars(key);
    const rr_only = vars
      .filter((name) => name.includes('.rr.'))
      .map((name) => name.split('.rr.')[1]);

    const dcs_only = vars
      .filter((name) => name.includes('.oms.'))
      .map((name) => name.split('.oms.')[1]);

    dcs_only.forEach((dcs_name) => {
      dcs_lumi_loss_total += val;
      if (typeof dcs_lumi_losses[dcs_name] === 'undefined') {
        dcs_lumi_losses[dcs_name] = val;
        dcs_lumi_losses_runs[dcs_name] =
          runs_lumisections_responsible_for_rule[key];
      } else {
        dcs_lumi_losses[dcs_name] = dcs_lumi_losses[dcs_name] + val;
        dcs_lumi_losses_runs[dcs_name] = add_jsons_fast(
          dcs_lumi_losses_runs[dcs_name],
          runs_lumisections_responsible_for_rule[key]
        );
      }
    });

    let subsystem_already_added = {};
    dcs_only.forEach((dcs_name) => {
      // We need to find to which subsystem does this dcs rule belong to:
      const subsystem = getWhichSubsystemDCSBelongsTo(dcs_name);
      if (typeof subsystem_already_added[subsystem] === 'undefined') {
        subsystem_lumi_loss_total += val;
        if (typeof subsystem_dcs_losses[subsystem] === 'undefined') {
          subsystem_dcs_losses[subsystem] = val;
          subsystem_dcs_losses_runs[subsystem] =
            runs_lumisections_responsible_for_rule[key];
        } else {
          subsystem_dcs_losses[subsystem] =
            subsystem_dcs_losses[subsystem] + val;
          subsystem_dcs_losses_runs[subsystem] = add_jsons_fast(
            subsystem_dcs_losses_runs[subsystem],
            runs_lumisections_responsible_for_rule[key]
          );
        }
        subsystem_already_added[subsystem] = true;
      }
    });

    rr_only.forEach((rr_name) => {
      rr_lumi_loss_total += val;
      if (typeof rr_lumi_losses[rr_name] === 'undefined') {
        rr_lumi_losses[rr_name] = val;
        rr_lumi_losses_runs[rr_name] =
          runs_lumisections_responsible_for_rule[key];
      } else {
        rr_lumi_losses[rr_name] = rr_lumi_losses[rr_name] + val;
        rr_lumi_losses_runs[rr_name] = add_jsons_fast(
          rr_lumi_losses_runs[rr_name],
          runs_lumisections_responsible_for_rule[key]
        );
      }
    });

    subsystem_already_added = {};
    rr_only.forEach((rr_name) => {
      const subsystem = rr_name.split('-')[0];
      if (typeof subsystem_already_added[subsystem] === 'undefined') {
        subsystem_rr_loss += val;
        if (typeof subsystem_rr_losses[subsystem] === 'undefined') {
          subsystem_rr_losses[subsystem] = val;
          subsystem_rr_losses_runs[subsystem] =
            runs_lumisections_responsible_for_rule[key];
        } else {
          subsystem_rr_losses[subsystem] = subsystem_rr_losses[subsystem] + val;
          subsystem_rr_losses_runs[subsystem] = add_jsons_fast(
            subsystem_rr_losses_runs[subsystem],
            runs_lumisections_responsible_for_rule[key]
          );
        }
        subsystem_already_added[subsystem] = true;
      }
    });

    const subsystem_already_added = {};
    rr_only.forEach((rr_name) => {
      const subsystem = rr_name.split('-')[0];
      if (typeof subsystem_already_added[subsystem] === 'undefined') {
        inclusive_loss += val;
        if (typeof inclusive_losses[subsystem] === 'undefined') {
          inclusive_losses[subsystem] = val;
          inclusive_losses_runs[subsystem] =
            runs_lumisections_responsible_for_rule[key];
        } else {
          inclusive_losses[subsystem] = inclusive_losses[subsystem] + val;
          inclusive_losses_runs[subsystem] = add_jsons_fast(
            inclusive_losses_runs[subsystem],
            runs_lumisections_responsible_for_rule[key]
          );
        }
        subsystem_already_added[subsystem] = true;
      }
    });

    dcs_only.forEach((dcs_name) => {
      // We need to find to which subsystem does this dcs rule belong to:
      const subsystem = getWhichSubsystemDCSBelongsTo(dcs_name);
      if (typeof subsystem_already_added[subsystem] === 'undefined') {
        inclusive_loss += val;
        if (typeof inclusive_losses[subsystem] === 'undefined') {
          inclusive_losses[subsystem] = val;
          inclusive_losses_runs[subsystem] =
            runs_lumisections_responsible_for_rule[key];
        } else {
          inclusive_losses[subsystem] = inclusive_losses[subsystem] + val;
          inclusive_losses_runs[subsystem] = add_jsons_fast(
            inclusive_losses_runs[subsystem],
            runs_lumisections_responsible_for_rule[key]
          );
        }
        subsystem_already_added[subsystem] = true;
      }
    });

    const loss_added = false;
    for (const [subsystem, dcs_bits] of Object.entries(dcs_mapping)) {
      const only_dcs_bits_from_this_subystem = dcs_only.every((dcs_bit) =>
        dcs_bits.includes(dcs_bit)
      );
      const only_rr_from_this_subystem = rr_only.every(
        (rr_rule) => rr_rule.split('-')[0] === subsystem
      );
      if (only_dcs_bits_from_this_subystem && only_rr_from_this_subystem) {
        exclusive_loss += val;
        loss_added = true;
        if (typeof exclusive_losses[subsystem] === 'undefined') {
          exclusive_losses[subsystem] = val;
          exclusive_losses_runs[subsystem] =
            runs_lumisections_responsible_for_rule[key];
        } else {
          exclusive_losses[subsystem] = exclusive_losses[subsystem] + val;
          exclusive_losses_runs[subsystem] = add_jsons_fast(
            exclusive_losses_runs[subsystem],
            runs_lumisections_responsible_for_rule[key]
          );
        }
      }
    }
    if (!loss_added) {
      exclusive_losses['mixed'] = exclusive_losses['mixed'] + val;
      exclusive_losses_runs['mixed'] = add_jsons_fast(
        exclusive_losses_runs['mixed'],
        runs_lumisections_responsible_for_rule[key]
      );
    }
  }
};
